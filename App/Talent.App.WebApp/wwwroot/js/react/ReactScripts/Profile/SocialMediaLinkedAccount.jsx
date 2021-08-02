/* Social media JSX 
chnaged file*/
import React from "react";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Popup, Button, Icon } from "semantic-ui-react";

export default class SocialMediaLinkedAccount extends React.Component {
	constructor(props) {
		super(props);
		const socialMediaAccounts = props.linkedAccounts
			? Object.assign({}, props.linkedAccounts)
			: {
					linkedIn: "",
					github: "",
			  };

		this.state = {
			showEditSection: false,
			newSocialMediaDetails: socialMediaAccounts,
		};
		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveSocialMediaDetails = this.saveSocialMediaDetails.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
	}
	openEdit() {
		const socialMediaAccounts = Object.assign({}, this.props.linkedAccounts);
		this.setState({
			showEditSection: true,
			newSocialMediaDetails: socialMediaAccounts,
		});
	}
	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}
	handleChange(event) {
		const data = Object.assign({}, this.state.newSocialMediaDetails);
		data[event.target.name] = event.target.value;
		this.setState({
			newSocialMediaDetails: data,
		});
	}
	saveSocialMediaDetails() {
		const mediaAccounts = {
			linkedAccounts: {
				linkedIn: "",
				github: "",
			},
		};
		//const data = Object.assign(mediaAccounts, this.state.newSocialMediaDetails);
		mediaAccounts.linkedAccounts["linkedIn"] =
			this.state.newSocialMediaDetails.linkedIn;
		mediaAccounts.linkedAccounts["github"] =
			this.state.newSocialMediaDetails.github;
		this.props.saveProfileData(mediaAccounts);
		this.closeEdit();
	}
	componentDidMount() {
		$(".ui.button.social-media").popup();
	}
	renderEdit() {
		return (
			<div className='ui sixteen wide column'>
				<ChildSingleInput
					inputType='text'
					label='LinkedIn'
					name='linkedIn'
					value={this.state.newSocialMediaDetails.linkedIn}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder='Enter your LinkedIn Url'
					errorMessage='Please enter a valid LinkedIn Url'
				/>
				<ChildSingleInput
					inputType='text'
					label='GitHub'
					name='github'
					value={this.state.newSocialMediaDetails.github}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder='Enter your GitHub Url'
					errorMessage='Please enter a valid GitHub Url'
				/>

				<button
					type='button'
					className='ui teal button'
					onClick={this.saveSocialMediaDetails}
				>
					Save
				</button>
				<button type='button' className='ui button' onClick={this.closeEdit}>
					Cancel
				</button>
			</div>
		);
	}
	renderDisplay() {
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<React.Fragment>
						<Button
							color='linkedin'
							disabled={this.props.linkedAccounts.linkedIn.length === 0}
							onClick={this.openEdit}
						>
							<Icon name='linkedin' /> LinkedIn
						</Button>
						<Button
							color='black'
							disabled={this.props.linkedAccounts.github.length === 0}
							onClick={this.openEdit}
						>
							<Icon name='github' /> GitHub
						</Button>
					</React.Fragment>
					<button
						type='button'
						className='ui right floated teal button'
						onClick={this.openEdit}
					>
						Edit
					</button>
				</div>
			</div>
		);
	}

	render() {
		return this.state.showEditSection
			? this.renderEdit()
			: this.renderDisplay();
	}
}
