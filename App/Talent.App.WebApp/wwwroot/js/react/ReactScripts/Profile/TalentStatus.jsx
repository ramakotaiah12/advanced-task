//chnaged file
import React from "react";
import { Radio, Form, Checkbox } from "semantic-ui-react";
import { SingleInput } from "../Form/SingleInput.jsx";

export default class TalentStatus extends React.Component {
	constructor(props) {
		super(props);
		const status = props.status
			? Object.assign({}, props.status)
			: {
					availableDate: "",
					status: "",
			  };
		this.state = {
			talentStatus: status,
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}
	onChangeHandler(e, d) {
		const newStatus = Object.assign({}, this.state.talentStatus);
		newStatus["status"] = d.value;
		newStatus["availableDate"] = new Date(Date.now());
		this.setState({
			talentStatus: newStatus,
		});

		this.props.saveProfileData({
			jobSeekingStatus: {
				availableDate: newStatus.availableDate,
				status: newStatus.status,
			},
		});
	}

	render() {
		const options = [
			{
				key: 1,
				text: "Activel looking for a job",
				value: 1,
			},
			{
				key: 2,
				text: "Not looking for a job at the moment",
				value: 2,
			},
			{
				key: 3,
				text: "Currently employed but open to offers",
				value: 3,
			},
			{
				key: 4,
				text: "Will be available on later date",
				value: 4,
			},
		];
		const status = this.props.status ? this.props.status.status : "";
		return (
			<Form.Field>
				<label>Current Status</label>

				{options.map((option) => (
					<React.Fragment key={option.key}>
						<Checkbox
							radio
							label={option.text}
							value={option.text}
							name={option.text}
							checked={option.text === status}
							onChange={this.onChangeHandler}
						/>
						<br />
					</React.Fragment>
				))}
				<br />
			</Form.Field>
		);
	}
}
