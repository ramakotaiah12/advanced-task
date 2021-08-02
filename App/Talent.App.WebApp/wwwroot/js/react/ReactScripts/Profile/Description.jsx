//changed file
import React from "react";
import Cookies from "js-cookie";
import { Input, TextArea } from "semantic-ui-react";

export class Description extends React.Component {
	constructor(props) {
		super(props);
		const description =
			props.description && props.summary
				? Object.assign(
						{},
						{ description: props.description, summary: props.summary }
				  )
				: {
						summary: "",
						description: "",
				  };
		this.state = {
			newDescription: description,
		};
		this.update = this.update.bind(this);
		this.saveDescriptionDetails = this.saveDescriptionDetails.bind(this);
	}

	update(event) {
		const data = Object.assign({}, this.state.newDescription);

		data[event.target.name] = event.target.value;
		this.setState({
			newDescription: data,
		});
	}
	saveDescriptionDetails() {
		this.props.saveProfileData(this.state.newDescription);
	}

	render() {
		return (
			<React.Fragment>
				<div className='twenty wide column'>
					<div className='field'>
						<TextArea
							rows={1}
							name='summary'
							placeholder='Please provide a short summary about yourself'
							onChange={(e) => this.update(e)}
						></TextArea>
						<p>Summary must be no more than 150 characters</p>
						<TextArea
							name='description'
							placeholder='Please tell us about any hobbies, additional expertise, or anything else you would like to add.'
							onChange={(e) => this.update(e)}
						></TextArea>
						<p>Description must be between 150-600 characters</p>
					</div>
					<button
						type='button'
						className='ui right floated teal button'
						onClick={this.saveDescriptionDetails}
					>
						Save
					</button>
				</div>
			</React.Fragment>
		);
	}
}
