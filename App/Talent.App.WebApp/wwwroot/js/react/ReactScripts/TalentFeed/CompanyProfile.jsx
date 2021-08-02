//chnaged file
import React from "react";
import { Image, Card, Icon } from "semantic-ui-react";

export default class CompanyProfile extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { company } = this.props;
		return (
			<Card>
				<Card.Content>
					<div className='center aligned'>
						<img
							className='ui circular image'
							src='http://semantic-ui.com/images/avatar/small/jenny.jpg'
						/>
						<Card.Header>
							<br />
							{company.name}
						</Card.Header>
						<Card.Meta>
							<Icon name='map marker alternate' /> {company.location.city}{" "}
							{company.location.country}
						</Card.Meta>
						<Card.Description>
							"We currently do not have specific skills that we desire"
						</Card.Description>
					</div>
				</Card.Content>
				<Card.Content extra>
					<div>
						<Icon name='phone volume'></Icon>
						{`: ${company.phone}`}
					</div>
					<div>
						<Icon name='mail'></Icon>
						{`: ${company.email}`}
					</div>
				</Card.Content>
			</Card>
		);
	}
}
