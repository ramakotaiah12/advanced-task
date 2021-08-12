//changed file
import React from "react";
import Cookies from "js-cookie";
import { Input, TextArea } from "semantic-ui-react";

export class Description extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			newDescription: "",
			newSummary: "",
			showEditSection: false,
		};
		this.onDescriptionChange = this.onDescriptionChange.bind(this);
		this.onSummaryChange = this.onSummaryChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.openEdit = this.openEdit.bind(this);
	}
	openEdit() {
		const data = Object.assign(
			{},
			{ summary: this.props.summary, description: this.props.description }
		);
		this.setState({
			showEditSection: true,
			newDescription: data.description,
			newSummary: data.summary,
		});
	}
	onSubmit() {
		this.props.saveProfileData({
			summary: this.state.newSummary,
			description: this.state.newDescription,
		});
		this.setState({ showEditSection: false });
	}
	onDescriptionChange(e) {
		this.setState({
			newDescription: e.target.value,
		});
	}
	onSummaryChange(e) {
		this.setState({
			newSummary: e.target.value,
		});
	}
	renderEdit() {
		return (
			<div className='twenty wide column'>
				<div className='field'>
					<TextArea
						autoFocus={true}
						onChange={this.onSummaryChange}
						value={this.state.newSummary}
						rows={1}
						name='summary'
						placeholder='Please provide a short summary about yourself'
					></TextArea>
					<p>Summary must be no more than 150 characters</p>
					<TextArea
						autoFocus
						onChange={this.onDescriptionChange}
						value={this.state.newDescription}
						name='description'
						placeholder='Please tell us about any hobbies, additional expertise, or anything else you would like to add.'
					></TextArea>
					<p>Description must be between 150-600 characters</p>
				</div>
				<button
					type='button'
					className='ui right floated teal button'
					onClick={this.onSubmit}
				>
					Save
				</button>
			</div>
		);
	}
	renderDisplay() {
		return (
			<div className='twenty wide column'>
				<div className='field'>
					<TextArea
						onClick={this.openEdit}
						value={this.props.summary}
						rows={1}
						name='summary'
						placeholder='Please provide a short summary about yourself'
					></TextArea>
					<p>Summary must be no more than 150 characters</p>
					<TextArea
						onClick={this.openEdit}
						value={this.props.description}
						name='description'
						placeholder='Please tell us about any hobbies, additional expertise, or anything else you would like to add.'
					></TextArea>
					<p>Description must be between 150-600 characters</p>
				</div>
				<button
					type='button'
					className='ui right floated teal button'
					onClick={this.onSubmit}
				>
					Save
				</button>
			</div>
		);
	}

	render() {
		return this.state.showEditSection
			? this.renderEdit()
			: this.renderDisplay();
	}
}
