//chnaged file
import React from "react";
import { SingleInput } from "../Form/SingleInput.jsx";
import { Dropdown, Grid, Label } from "semantic-ui-react";

export default class VisaStatus extends React.Component {
	constructor(props) {
		super(props);
		const status = props.visaStatus ? props.visaStatus : "";
		const expiryDate = props.visaExpiryDate ? props.visaExpiryDate : "";
		this.state = {
			visaStatus: status,
			visaExpiryDate: expiryDate,
		};
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.submitStatus = this.submitStatus.bind(this);
		this.saveVisaDetails = this.saveVisaDetails.bind(this);
	}
	saveVisaDetails() {
		if (this.state.visaExpiryDate === "") {
			return TalentUtil.notification.show(
				"Please Enter visa expiry date",
				"error",
				null,
				null
			);
		}
		if (this.state.visaStatus === "" || this.props.visaExpiryDate === "") {
			this.props.saveProfileData({
				visaStatus: this.props.visaStatus,
				visaExpiryDate: this.props.visaExpiryDate,
			});
		} else {
			this.props.saveProfileData({
				visaStatus: this.state.visaStatus,
				visaExpiryDate: this.state.visaExpiryDate,
			});
		}
	}
	submitStatus() {
		if (
			this.state.visaStatus === "Citizen" ||
			this.state.visaStatus === "Permanent Resident"
		) {
			this.props.saveProfileData({
				visaStatus: this.state.visaStatus,
				visaExpiryDate: "",
			});
		} else {
			this.props.updateProfileData({
				visaStatus: this.state.visaStatus,
			});
		}
	}
	handleStatusChange(e, d) {
		this.setState(
			{
				visaStatus: d.value,
				visaExpiryDate: "",
			},
			this.submitStatus
		);
	}
	handleDateChange(e) {
		this.setState({
			visaExpiryDate: e.target.value,
		});
	}
	render() {
		var now = new Date();
		var todayUTC = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
		);
		const visaOptions = [
			{ key: "Citizen", text: "Citizen", value: "Citizen" },
			{
				key: "Permanent Resident",
				text: "Permanent Resident",
				value: "Permanent Resident",
			},
			{ key: "Work Visa", text: "Work Visa", value: "Work Visa" },
			{ key: "Student Visa", text: "Student Visa", value: "Student Visa" },
		];
		const date =
			this.props.visaExpiryDate !== null &&
			this.props.visaExpiryDate !== "" &&
			this.state.visaExpiryDate === ""
				? this.props.visaExpiryDate.split("T")[0]
				: this.state.visaExpiryDate.split("T")[0];
		const dateString =
			this.state.visaExpiryDate === "" && this.props.visaExpiryDate === ""
				? ""
				: date;
		const status =
			this.state.visaStatus === ""
				? this.props.visaStatus
				: this.state.visaStatus;
		return (
			<Grid columns='equal'>
				<Grid.Row>
					<Grid.Column width={7}>
						<label>Visa Type</label>
						<Dropdown
							name='visaStatus'
							placeholder='Visa Status'
							value={status}
							onChange={this.handleStatusChange}
							search
							selection
							options={visaOptions}
						></Dropdown>
					</Grid.Column>
					{this.state.visaStatus === "Permanent Resident" ||
					this.state.visaStatus === "Citizen" ||
					this.props.visaStatus === "Permanent Resident" ||
					this.props.visaStatus === "Citizen" ||
					this.props.visaStatus === null ? (
						""
					) : (
						<Grid.Column>
							<Grid>
								<Grid.Column width={10}>
									<label>Visa Expiry Date</label>
									<SingleInput
										isError={false}
										inputType='date'
										name='visaExpiryDate'
										content={dateString}
										controlFunc={this.handleDateChange}
										maxLength={80}
										min={todayUTC.toISOString().slice(0, 10)}
										errorMessage='Please enter visa expiry date'
									/>
								</Grid.Column>
								<Grid.Column width={6}>
									<br />
									<button
										type='button'
										className='ui right floated teal button'
										onClick={this.saveVisaDetails}
									>
										Save
									</button>
								</Grid.Column>
							</Grid>
						</Grid.Column>
					)}
				</Grid.Row>
			</Grid>
		);
	}
}
