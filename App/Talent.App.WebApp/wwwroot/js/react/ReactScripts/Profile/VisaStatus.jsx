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
		this.handleVisaExpiryDateChange =
			this.handleVisaExpiryDateChange.bind(this);
		this.handleVisaStatusChange = this.handleVisaStatusChange.bind(this);
		this.saveVisaDetails = this.saveVisaDetails.bind(this);
	}
	saveVisaDetails() {
		this.props.saveProfileData({ visaExpiryDate: this.state.visaExpiryDate });
	}
	handleVisaExpiryDateChange(e) {
		const visaExpiryDateDetail = e.target.value;
		this.setState({
			visaExpiryDate: visaExpiryDateDetail,
		});
	}
	handleVisaStatusChange(e, d) {
		const visaDetails = d.value;
		this.setState({
			visaStatus: visaDetails,
		});
		if (visaDetails === "Permanent Resident" || visaDetails === "Citizen") {
			this.props.saveProfileData({
				visaStatus: visaDetails,
				visaExpiryDate: "",
			});
		} else {
			this.props.updateProfileData({ visaStatus: visaDetails });
		}
	}
	render() {
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

		return (
			<Grid columns='equal'>
				<Grid.Row>
					<Grid.Column width={7}>
						<label>Visa Type</label>
						<Dropdown
							name='visaStatus'
							placeholder='Visa Status'
							value={this.props.visaStatus}
							onChange={this.handleVisaStatusChange}
							search
							selection
							options={visaOptions}
						></Dropdown>
					</Grid.Column>
					{this.props.visaStatus === "Permanent Resident" ||
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
										content={date}
										controlFunc={this.handleVisaExpiryDateChange}
										maxLength={80}
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
