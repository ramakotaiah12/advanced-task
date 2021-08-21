//chnaged file
import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import TalentCard from "../TalentFeed/TalentCard.jsx";
import { Loader, Grid, Image, Segment } from "semantic-ui-react";
import CompanyProfile from "../TalentFeed/CompanyProfile.jsx";
import FollowingSuggestion from "../TalentFeed/FollowingSuggestion.jsx";
import { BodyWrapper, loaderData } from "../Layout/BodyWrapper.jsx";

export default class TalentFeed extends React.Component {
	constructor(props) {
		super(props);

		let loader = loaderData;
		loader.allowedUsers.push("Employer");
		loader.allowedUsers.push("Recruiter");

		this.state = {
			employerData: {},
			loadNumber: 5,
			loadPosition: 0,
			feedData: [],
			watchlist: [],
			loaderData: loader,
			loadingFeedData: false,
			companyDetails: null,
		};

		this.init = this.init.bind(this);
		this.loadData = this.loadData.bind(this);
		this.talentData = this.talentData.bind(this);
		this.updateWithoutSave = this.updateWithoutSave.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}

	handleScroll(e) {
		const windowHeight = window.innerHeight
			? window.innerHeight
			: document.documentElement.offsetHeight;
		const { body } = document;
		const html = document.documentElement;
		const docHeight = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);
		const windowBottom = Math.round(windowHeight + window.pageYOffset);

		const difference = docHeight - windowBottom;
		const additional = difference >= 1 && difference <= 2 ? difference : 0;

		if (windowBottom + additional >= docHeight) {
			console.log(true);
			const position = this.state.loadPosition + 5;
			this.setState(
				{
					loadPosition: position,
				},
				() => this.talentData()
			);
		}
	}
	init() {
		let loaderData = TalentUtil.deepCopy(this.state.loaderData);
		loaderData.isLoading = false;
		this.setState({ loaderData }); //comment this
		this.loadData();
	}
	loadData() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://profile-advanced-task.azurewebsites.net/profile/profile/getEmployerProfile",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			success: function (res) {
				let employerData = null;
				if (res.employer) {
					employerData = res.employer;
					this.updateWithoutSave(employerData);
				}
			}.bind(this),
			error: function (res) {
				console.log(res.status);
			},
		});
	}
	talentData() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://profile-advanced-task.azurewebsites.net/profile/profile/getTalent",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			data: {
				position: this.state.loadPosition,
				number: this.state.loadNumber,
			},

			contentType: "application/json",
			dataType: "json",
			success: function (res) {
				if (res.success) {
					console.log(this.state.loadPosition);
					var newArray = [...this.state.feedData, ...res.data];
					console.log(newArray);
					this.setState({
						feedData: newArray,
					});
					window.removeEventListener("scroll", this.handleScroll, false);
				}
			}.bind(this),
			error: function (res) {
				console.log(res.status);
			},
		});
	}
	updateWithoutSave(newData) {
		let newSD = Object.assign({}, this.state.employerData, newData);
		this.setState({
			employerData: newSD,
		});
	}

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll, true);
		this.init();
		this.talentData();
	}

	render() {
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<div className='ui container' onScroll={(e) => this.handleScroll(e)}>
					<Grid>
						<Grid.Row>
							<Grid.Column width={4}>
								{this.state.employerData.companyContact ? (
									<CompanyProfile
										company={this.state.employerData.companyContact}
									/>
								) : (
									""
								)}
							</Grid.Column>
							<Grid.Column width={8}>
								<TalentCard profiles={this.state.feedData} />
							</Grid.Column>
							<Grid.Column width={4}>
								<FollowingSuggestion profiles={this.state.feedData} />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</div>
			</BodyWrapper>
		);
	}
}
