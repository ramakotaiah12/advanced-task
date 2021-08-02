/* Language section 
chnaged file */
import React from "react";
import Cookies from "js-cookie";
import { Grid, Icon, Input, Table, Dropdown, Button } from "semantic-ui-react";

export default class Language extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showEditSection: false,
			showUpdateSection: false,
			updateId: "",
			languageName: "",
			languageLevel: "",
		};
		this.openAdd = this.openAdd.bind(this);
		this.closeAdd = this.closeAdd.bind(this);
		this.addLanguage = this.addLanguage.bind(this);
		this.onLanguageNameChange = this.onLanguageNameChange.bind(this);
		this.onLanguageLevelChange = this.onLanguageLevelChange.bind(this);
		this.deleteLanguage = this.deleteLanguage.bind(this);
		this.openUpdate = this.openUpdate.bind(this);
		this.closeUpdate = this.closeUpdate.bind(this);
		this.updateLanguage = this.updateLanguage.bind(this);
	}

	onLanguageNameChange(e) {
		this.setState({ languageName: e.target.value });
	}
	onLanguageLevelChange(e) {
		this.setState({ languageLevel: e.target.value });
	}
	openUpdate(id) {
		this.setState({
			showEditSection: false,
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
			showEditSection: true,
			showUpdateSection: false,
		});
	}
	closeAdd() {
		this.setState({
			showEditSection: false,
		});
	}
	updateLanguage(language) {
		language.name = this.state.languageName;
		language.level = this.state.languageLevel;
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "http://localhost:60290/profile/profile/UpdateLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(language),
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

	deleteLanguage(language) {
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: "http://localhost:60290/profile/profile/DeleteLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(language),
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
	addLanguage() {
		var cookies = Cookies.get("talentAuthToken");
		const language = {
			name: this.state.languageName,
			level: this.state.languageLevel,
		};

		$.ajax({
			url: "http://localhost:60290/profile/profile/AddLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(language),
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

	render() {
		return this.state.showEditSection ? this.renderAdd() : this.renderDisplay();
	}
	renderAdd() {
		return (
			<div className='row'>
				<div className='ui sixteen wide column'>
					<Grid columns='equal'>
						<Grid.Column>
							<Input
								placeholder='Add Language'
								onChange={this.onLanguageNameChange}
								autoFocus={true}
							/>
						</Grid.Column>
						<Grid.Column>
							<select name='level' onChange={this.onLanguageLevelChange}>
								<option value=''>Select Level</option>
								<option value='Basic'>Basic</option>
								<option value='Conversational'>Conversational</option>
								<option value='Fluent'>Fluent</option>
								<option value='Native/Bilingual'>Native/Bilingual</option>
							</select>
						</Grid.Column>
						<Grid.Column>
							<button
								type='button'
								className='ui teal button'
								onClick={this.addLanguage}
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
								<Table.HeaderCell>Language</Table.HeaderCell>
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
							{this.props.languageData.map((language) =>
								this.state.showUpdateSection &&
								this.state.updateId === language.id ? (
									<Table.Row key={language.id}>
										<Table.Cell>
											<Input
												autoFocus={true}
												placeholder='Add Language'
												defaultValue={language.name}
												name='name'
												onChange={this.onLanguageNameChange}
											/>
										</Table.Cell>
										<Table.Cell>
											<select
												name='level'
												value={language.level}
												onChange={this.onLanguageLevelChange}
											>
												<option value='Basic'>Basic</option>
												<option value='Conversational'>Conversational</option>
												<option value='Fluent'>Fluent</option>
												<option value='Native/Bilingual'>
													Native/Bilingual
												</option>
											</select>
										</Table.Cell>
										<Table.Cell textAlign='right'>
											<Button
												basic
												color='blue'
												type='button'
												onClick={() => this.updateLanguage(language)}
											>
												Update
											</Button>
											<Button basic color='red' onClick={this.closeUpdate}>
												Cancel
											</Button>
										</Table.Cell>
									</Table.Row>
								) : (
									<Table.Row key={language.id}>
										<Table.Cell>{language.name}</Table.Cell>
										<Table.Cell>{language.level}</Table.Cell>
										<Table.Cell textAlign='right'>
											<Icon
												name='pencil alternate'
												onClick={() => this.openUpdate(language.id)}
											></Icon>

											<Icon
												name='delete'
												onClick={() => this.deleteLanguage(language)}
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
}
