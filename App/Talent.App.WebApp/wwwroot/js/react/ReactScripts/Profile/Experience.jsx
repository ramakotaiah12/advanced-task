//chnaged file --
/* Experience section */
import React from "react";
import Cookies from "js-cookie";
import { Grid, Icon, Input, Table, Dropdown, Button } from "semantic-ui-react";
import { ChildSingleInput, SingleInput } from "../Form/SingleInput.jsx";
export default class Experience extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddSection: false,
			showUpdateSection: false,
			updateId: "",
			experience: {
				id: "",
				userId: "",
				company: "",
				position: "",
				responsibilities: "",
				start: "",
				end: "",
			},
		};
		this.deleteExperience = this.deleteExperience.bind(this);
		this.updateExperience = this.updateExperience.bind(this);

		this.addExperience = this.addExperience.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.openAdd = this.openAdd.bind(this);
		this.closeAdd = this.closeAdd.bind(this);
		this.openUpdate = this.openUpdate.bind(this);
		this.closeUpdate = this.closeUpdate.bind(this);
	}
	updateExperience() {
		const data = Object.assign({}, this.state.experience);
		if (data.start >= data.end) {
			return TalentUtil.notification.show(
				`Please check start and end dates`,
				"error",
				null,
				null
			);
		}
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "https://profile-advanced-task.azurewebsites.net/profile/profile/UpdateExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(data),
			success: function (res) {
				if (res.success == true) {
					this.props.updateProfileData();
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
				this.closeUpdate();
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}
	openUpdate(experience) {
		const data = Object.assign({}, experience);
		this.setState({
			showAddSection: false,
			showUpdateSection: true,
			updateId: experience.id,
			experience: data,
		});
	}
	closeUpdate() {
		const data = Object.assign(
			{},
			{
				id: "",
				userId: "",
				company: "",
				position: "",
				responsibilities: "",
				start: "",
				end: "",
			}
		);
		this.setState({
			showUpdateSection: false,
			experience: data,
		});
	}
	deleteExperience(experience) {
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "https://profile-advanced-task.azurewebsites.net/profile/profile/DeleteExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(experience),
			success: function (res) {
				if (res.success == true) {
					this.props.updateProfileData();
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}
	addExperience() {
		if (this.state.experience.start >= this.state.experience.end) {
			return TalentUtil.notification.show(
				`Please check start and end dates`,
				"error",
				null,
				null
			);
		}
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://profile-advanced-task.azurewebsites.net/profile/profile/AddExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(this.state.experience),
			success: function (res) {
				if (res.success == true) {
					this.props.updateProfileData();
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
				this.closeAdd();
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	handleChange(event) {
		const data = Object.assign({}, this.state.experience);
		data[event.target.name] = event.target.value;
		this.setState({
			experience: data,
		});
	}
	openAdd() {
		this.setState(
			{
				showAddSection: true,
			},
			this.closeUpdate
		);
	}
	closeAdd() {
		const data = Object.assign(
			{},
			{
				id: "",
				userId: "",
				company: "",
				position: "",
				responsibilities: "",
				start: "",
				end: "",
			}
		);
		this.setState({
			showAddSection: false,
			experience: data,
		});
	}
	renderAdd() {
		var now =
			this.state.experience.start === ""
				? new Date("1970-1-1")
				: new Date(this.state.experience.start);

		var todayUTC = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
		);
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<Grid columns='equal'>
						<Grid.Row>
							<Grid.Column>
								<ChildSingleInput
									autoFocus={true}
									inputType='text'
									label='Company'
									name='company'
									value={this.state.experience.company}
									controlFunc={this.handleChange}
									maxLength={80}
									placeholder='Enter your company name'
									errorMessage='Please enter a valid company name'
								/>
							</Grid.Column>
							<Grid.Column>
								<ChildSingleInput
									inputType='text'
									label='Position'
									name='position'
									value={this.state.experience.position}
									controlFunc={this.handleChange}
									maxLength={80}
									placeholder='Enter your company name'
									errorMessage='Please enter a valid company name'
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<label>Start Date</label>
								<SingleInput
									isError={false}
									inputType='date'
									name='start'
									content={this.state.experience.start}
									controlFunc={this.handleChange}
									maxLength={80}
									errorMessage='Please enter visa expiry date'
								/>
							</Grid.Column>
							<Grid.Column>
								<label>End Date</label>
								<SingleInput
									min={todayUTC.toISOString().slice(0, 10)}
									isError={false}
									inputType='date'
									name='end'
									content={this.state.experience.end}
									controlFunc={this.handleChange}
									maxLength={80}
									errorMessage='Please enter visa expiry date'
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<ChildSingleInput
									inputType='text'
									label='Responsibilities'
									name='responsibilities'
									value={this.state.experience.responsibilities}
									controlFunc={this.handleChange}
									maxLength={80}
									placeholder='Enter your company name'
									errorMessage='Please enter a valid company name'
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<button
									type='button'
									id=''
									className='ui teal button'
									onClick={this.addExperience}
								>
									Save
								</button>
								<button
									type='button'
									className='ui button'
									onClick={this.closeAdd}
								>
									Cancel
								</button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
					<Grid>{this.renderDisplay()}</Grid>
				</div>
			</div>
		);
	}
	renderDisplay() {
		var now =
			this.state.experience.start === ""
				? new Date("1970-1-1")
				: new Date(this.state.experience.start);
		var todayUTC = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
		);
		console.log(todayUTC);
		let format = (d, a = d.toString().split` `) =>
			a[2] + "-" + a[1] + "-" + a[3];
		const data = Object.assign({}, this.state.experience);
		var now = data.start === "" ? new Date("1970-1-1") : new Date(data.start);
		var todayUTC = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
		);
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Company</Table.HeaderCell>
								<Table.HeaderCell>Postion</Table.HeaderCell>
								<Table.HeaderCell>Responsibilities</Table.HeaderCell>
								<Table.HeaderCell>Start</Table.HeaderCell>
								<Table.HeaderCell>End</Table.HeaderCell>
								<Table.HeaderCell>
									<button
										type='button'
										id='save'
										className='ui right floated teal button'
										onClick={this.openAdd}
									>
										<Icon name='plus square outline'></Icon>Add New
									</button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{this.props.experienceData.map((experience) =>
								this.state.showUpdateSection &&
								this.state.updateId == experience.id ? (
									<Table.Row key={experience.id}>
										<Table.Cell colSpan='6'>
											<div className='ui sixteen wide column'>
												<Grid columns='equal'>
													<Grid.Row>
														<Grid.Column>
															<ChildSingleInput
																autoFocus={true}
																inputType='text'
																label='Company'
																name='company'
																value={data.company}
																controlFunc={this.handleChange}
																maxLength={80}
																placeholder='Enter your company name'
																errorMessage='Please enter a valid company name'
															/>
														</Grid.Column>
														<Grid.Column>
															<ChildSingleInput
																inputType='text'
																label='Position'
																name='position'
																value={data.position}
																controlFunc={this.handleChange}
																maxLength={80}
																placeholder='Enter your company name'
																errorMessage='Please enter a valid company name'
															/>
														</Grid.Column>
													</Grid.Row>
													<Grid.Row>
														<Grid.Column>
															<label>Start Date</label>
															<SingleInput
																isError={false}
																inputType='date'
																name='start'
																content={data.start.split("T")[0]}
																controlFunc={this.handleChange}
																maxLength={80}
																errorMessage='Please enter visa expiry date'
															/>
														</Grid.Column>
														<Grid.Column>
															<label>End Date</label>
															<SingleInput
																isError={false}
																inputType='date'
																name='end'
																min={todayUTC.toISOString().slice(0, 10)}
																content={data.end.split("T")[0]}
																controlFunc={this.handleChange}
																maxLength={80}
																errorMessage='Please enter visa expiry date'
															/>
														</Grid.Column>
													</Grid.Row>
													<Grid.Row>
														<Grid.Column>
															<ChildSingleInput
																inputType='text'
																label='Responsibilities'
																name='responsibilities'
																value={data.responsibilities}
																controlFunc={this.handleChange}
																maxLength={80}
																placeholder='Enter your company name'
																errorMessage='Please enter a valid company name'
															/>
														</Grid.Column>
													</Grid.Row>
													<Grid.Row>
														<Grid.Column>
															<button
																type='button'
																id=''
																className='ui teal button'
																onClick={() => this.updateExperience()}
															>
																Save
															</button>
															<button
																type='button'
																className='ui button'
																onClick={this.closeUpdate}
															>
																Cancel
															</button>
														</Grid.Column>
													</Grid.Row>
												</Grid>
											</div>
										</Table.Cell>
									</Table.Row>
								) : (
									<Table.Row key={experience.id}>
										<Table.Cell>{experience.company}</Table.Cell>
										<Table.Cell>{experience.position}</Table.Cell>
										<Table.Cell>{experience.responsibilities}</Table.Cell>
										<Table.Cell>
											{format(new Date(experience.start))}
										</Table.Cell>
										<Table.Cell>{format(new Date(experience.end))}</Table.Cell>
										<Table.Cell textAlign='right'>
											<Icon
												name='pencil alternate'
												onClick={() => this.openUpdate(experience)}
											></Icon>
											<Icon
												name='cancel'
												onClick={() => this.deleteExperience(experience)}
											></Icon>
										</Table.Cell>
									</Table.Row>
								)
							)}
						</Table.Body>
					</Table>
				</div>
			</div>
		);
	}
	render() {
		return this.state.showAddSection ? this.renderAdd() : this.renderDisplay();
	}
}
