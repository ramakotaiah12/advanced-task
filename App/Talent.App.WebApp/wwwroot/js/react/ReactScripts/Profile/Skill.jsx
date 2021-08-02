/* Skill section 
chnaged file*/
import React from "react";
import Cookies from "js-cookie";
import { Grid, Icon, Input, Table, Button } from "semantic-ui-react";
export default class Skill extends React.Component {
	constructor(props) {
		super(props);
		const newSkill = {
			id: "",
			name: "",
			level: "",
			currentUserId: "",
		};
		this.state = {
			showAddSection: false,
			showUpdateSection: false,
			updateId: "",
			skill: newSkill,
		};
		this.openAdd = this.openAdd.bind(this);
		this.closeAdd = this.closeAdd.bind(this);
		this.openUpdate = this.openUpdate.bind(this);
		this.closeUpdate = this.closeUpdate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addSkill = this.addSkill.bind(this);
		this.updateSkill = this.updateSkill.bind(this);
		this.deleteSkill = this.deleteSkill.bind(this);
	}
	handleChange(event) {
		const data = Object.assign({}, this.state.skill);
		data[event.target.name] = event.target.value;
		this.setState({
			skill: data,
		});
	}
	openUpdate(id) {
		this.setState({
			showAddSection: false,
			showUpdateSection: true,
			updateId: id,
		});
	}
	closeUpdate() {
		this.setState({
			showUpdateSection: false,
		});
	}
	openAdd() {
		this.setState({
			showAddSection: true,
			showUpdateSection: false,
		});
	}
	closeAdd() {
		this.setState({
			showAddSection: false,
		});
	}
	addSkill() {
		var cookies = Cookies.get("talentAuthToken");
		const skill = {
			name: this.state.skill.name,
			level: this.state.skill.level,
		};
		$.ajax({
			url: "http://localhost:60290/profile/profile/AddSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(skill),
			success: function (res) {
				if (res.success == true) {
					TalentUtil.notification.show(`${res.message}`, "success", null, null);
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
				this.closeAdd();
				window.location.reload();
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}
	updateSkill(id) {
		const data = Object.assign({}, this.state.skill);
		const skill = {
			name: data.name,
			level: data.level,
			id: id,
			currentUserId: data.currentUserId,
		};
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "http://localhost:60290/profile/profile/UpdateSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(skill),
			success: function (res) {
				if (res.success == true) {
					TalentUtil.notification.show(`${res.message}`, "success", null, null);
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
				window.location.reload();
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}
	deleteSkill(skill) {
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "http://localhost:60290/profile/profile/DeleteSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(skill),
			success: function (res) {
				if (res.success == true) {
					TalentUtil.notification.show(`${res.message}`, "success", null, null);
				} else {
					TalentUtil.notification.show(`${res.message}`, "error", null, null);
				}
				window.location.reload();
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}
	renderAdd() {
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<Grid columns='equal'>
						<Grid.Column>
							<Input
								autoFocus={true}
								placeholder='Add Skill'
								name='name'
								onChange={this.handleChange}
							/>
						</Grid.Column>
						<Grid.Column>
							<select name='level' onChange={this.handleChange}>
								<option value=''>Skill Level</option>
								<option value='Beginner'>Beginner</option>
								<option value='Intermediate'>Intermediate</option>
								<option value='Expert'>Expert</option>
							</select>
						</Grid.Column>
						<Grid.Column>
							<button
								type='button'
								className='ui teal button'
								onClick={this.addSkill}
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
					</Grid>
					<Grid>{this.renderDisplay()}</Grid>
				</div>
			</div>
		);
	}
	renderDisplay() {
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Skill</Table.HeaderCell>
								<Table.HeaderCell>Level</Table.HeaderCell>
								<Table.HeaderCell>
									<button
										type='button'
										className='ui right floated teal button'
										onClick={this.openAdd}
									>
										<Icon name='plus square outline'></Icon>Add New
									</button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{this.props.skillData.map((skill) =>
								this.state.showUpdateSection &&
								this.state.updateId == skill.id ? (
									<Table.Row key={skill.id}>
										<Table.Cell>
											<Input
												autoFocus={true}
												placeholder='Add Skill'
												defaultValue={skill.name}
												name='name'
												onChange={this.handleChange}
											/>
										</Table.Cell>
										<Table.Cell>
											<select
												name='level'
												defaultValue={skill.level}
												onChange={this.handleChange}
											>
												<option value='Beginner'>Beginner</option>
												<option value='Intermediate'>Intermediate</option>
												<option value='Expert'>Expert</option>
											</select>
										</Table.Cell>
										<Table.Cell textAlign='right'>
											<Button
												basic
												color='blue'
												type='button'
												onClick={() => this.updateSkill(skill.id)}
											>
												Update
											</Button>
											<Button
												type='button'
												basic
												color='red'
												onClick={this.closeUpdate}
											>
												Cancel
											</Button>
										</Table.Cell>
									</Table.Row>
								) : (
									<Table.Row key={skill.id}>
										<Table.Cell>{skill.name}</Table.Cell>
										<Table.Cell>{skill.level}</Table.Cell>
										<Table.Cell textAlign='right'>
											<Icon
												name='pencil alternate'
												onClick={() => this.openUpdate(skill.id)}
											></Icon>
											<Icon
												name='cancel'
												onClick={() => this.deleteSkill(skill)}
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
