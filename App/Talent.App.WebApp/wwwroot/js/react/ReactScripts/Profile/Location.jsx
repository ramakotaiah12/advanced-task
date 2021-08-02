//chnaged file
import React from "react";
import Cookies from "js-cookie";
import { default as Countries } from "../../../../util/jsonFiles/countries.json";
import { default as Nationalities } from "../../../../util/jsonFiles/nationalities.json";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Grid, Dropdown } from "semantic-ui-react";
export class Address extends React.Component {
	constructor(props) {
		super(props);
		const addressDetails = props.addressData
			? Object.assign({}, props.addressData)
			: {
					city: "",
					country: "",
					number: "",
					postCode: "",
					street: "",
					suburb: "",
			  };
		this.state = {
			newAddressDetails: addressDetails,
			showEditSection: false,
		};
		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.handleCityChange = this.handleCityChange.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.saveAddressDetails = this.saveAddressDetails.bind(this);
	}

	saveAddressDetails() {
		const details = {
			address: {
				city: "",
				country: "",
				number: "",
				postCode: "",
				street: "",
				suburb: "",
			},
		};

		details.address["city"] = this.state.newAddressDetails.city;
		details.address["country"] = this.state.newAddressDetails.country;
		details.address["number"] = this.state.newAddressDetails.number;
		details.address["postCode"] = this.state.newAddressDetails.postCode;
		details.address["street"] = this.state.newAddressDetails.street;
		details.address["suburb"] = this.state.newAddressDetails.suburb;
		this.setState({
			newAddressDetails: details.address,
		});
		this.props.saveProfileData(details);
		this.closeEdit();
	}
	handleCityChange(event, data) {
		const details = Object.assign({}, this.state.newAddressDetails);
		details[data.name] = data.value;
		this.setState({
			newAddressDetails: details,
		});
	}
	handleCountryChange(event, data) {
		const details = Object.assign({}, this.state.newAddressDetails);
		details[data.name] = data.value;
		this.setState({
			newAddressDetails: details,
		});
	}
	handleChange(event) {
		const data = Object.assign({}, this.state.newAddressDetails);
		data[event.target.name] = event.target.value;
		this.setState({
			newAddressDetails: data,
		});
	}
	openEdit() {
		const addressDetails = Object.assign({}, this.props.addressData);
		this.setState({
			showEditSection: true,
			newAddressDetails: addressDetails,
		});
	}
	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}
	render() {
		return this.state.showEditSection
			? this.renderEdit()
			: this.renderDisplay();
	}
	renderEdit() {
		const countriesOptions = Object.keys(Countries).map((country, index) => ({
			key: country,
			text: country,
			value: country,
		}));

		const citiesOptions = this.state.newAddressDetails.country
			? Countries[this.state.newAddressDetails.country].map((city, index) => ({
					key: index,
					text: city,
					value: city,
			  }))
			: [{ key: "city", text: "City", value: "City" }];
		const { number, street, suburb, country, city, postCode } =
			this.state.newAddressDetails;
		return (
			<React.Fragment>
				<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column>
							<ChildSingleInput
								inputType='text'
								label='Number'
								name='number'
								value={number}
								controlFunc={this.handleChange}
								maxLength={80}
								errorMessage='Please enter a valid number'
							/>
						</Grid.Column>
						<Grid.Column width={8}>
							<ChildSingleInput
								inputType='text'
								label='Street'
								name='street'
								value={street}
								controlFunc={this.handleChange}
								maxLength={80}
								errorMessage='Please enter a valid street name'
							/>
						</Grid.Column>
						<Grid.Column>
							<ChildSingleInput
								inputType='text'
								label='Suburb'
								name='suburb'
								value={suburb}
								controlFunc={this.handleChange}
								maxLength={80}
								errorMessage='Please enter a valid suburb name'
							/>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<label>Country</label>
							<Dropdown
								name='country'
								label='Country'
								placeholder='Country'
								defaultValue={country}
								onChange={this.handleCountryChange}
								search
								selection
								options={countriesOptions}
							></Dropdown>
						</Grid.Column>
						<Grid.Column>
							<label>City</label>
							<Dropdown
								name='city'
								placeholder='City'
								defaultValue={city}
								onChange={this.handleCityChange}
								search
								selection
								options={citiesOptions}
							></Dropdown>
						</Grid.Column>
						<Grid.Column>
							<ChildSingleInput
								inputType='text'
								label='Post Code'
								name='postCode'
								value={postCode}
								controlFunc={this.handleChange}
								maxLength={80}
								placeholder='Post Code'
								errorMessage='Please enter a valid post code'
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Grid>
					<Grid.Column>
						<button
							type='button'
							className='ui teal button'
							onClick={this.saveAddressDetails}
						>
							Save
						</button>
						<button
							type='button'
							className='ui button'
							onClick={this.closeEdit}
						>
							Cancel
						</button>
					</Grid.Column>
				</Grid>
			</React.Fragment>
		);
	}
	renderDisplay() {
		const { number, street, suburb, country, city, postCode } =
			this.props.addressData;
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<React.Fragment>
						<p>
							Address: {number} {street} {suburb} {postCode}
						</p>
						<p>City: {city}</p>
						<p>Country: {country} </p>
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
}

export class Nationality extends React.Component {
	constructor(props) {
		super(props);
		const nationality = props.nationalityData
			? Object.assign({}, { nationality: props.nationalityData })
			: {
					nationality: "",
			  };
		this.state = {
			newNationality: nationality,
		};
		this.onNationalityChange = this.onNationalityChange.bind(this);
	}
	onNationalityChange(e, d) {
		const data = Object.assign({}, this.state.newNationality);
		data["nationality"] = d.value;
		this.setState({
			newNationality: data,
		});
		this.props.saveProfileData(data);
	}

	render() {
		const nationalityOptions = Nationalities.map((nation, index) => ({
			key: nation,
			text: nation,
			value: nation,
		}));

		return (
			<Grid>
				<Grid.Column>
					<Dropdown
						value={this.props.nationalityData}
						search
						selection
						options={nationalityOptions}
						placeholder='Select your nationality'
						onChange={(e, d) => this.onNationalityChange(e, d)}
					/>
				</Grid.Column>
			</Grid>
		);
	}
}
