import React from "react";
import ReactDOM from "react-dom";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import {
	Card,
	Icon,
	Image,
	Grid,
	Button,
	Item,
	Header,
} from "semantic-ui-react";
export default class TalentCardDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showVideo: true,
		};
		this.closeVideo = this.closeVideo.bind(this);
		this.openVideo = this.openVideo.bind(this);
	}

	closeVideo() {
		this.setState({
			showVideo: false,
		});
	}
	openVideo() {
		this.setState({
			showVideo: true,
		});
	}

	render() {
		const { profile } = this.props;
		return (
			<Card fluid>
				<Card.Content>
					<Icon className='right floated' name='star' size='large'></Icon>
					<Card.Header>{profile.name}</Card.Header>
				</Card.Content>

				{this.state.showVideo ? (
					<Card.Content>
						<video autoPlay controls width='500px' src='video.mp4'></video>
						{/* <ReactPlayer
							width='500px'
							url='https://www.youtube.com/watch?v=w7ejDZ8SWv8&t=12s'
						/> */}
					</Card.Content>
				) : (
					<Card.Content>
						<Item>
							{profile.photoId ? (
								<Image
									style={{
										width: 200,
										height: 200,
										overflow: "hidden",
										borderWidth: 3,
										borderColor: "red",
									}}
									floated='left'
									src={profile.photoId}
								/>
							) : (
								<Image
									style={{
										width: 200,
										height: 200,
										overflow: "hidden",
										borderWidth: 3,
										borderColor: "red",
									}}
									floated='left'
									src='https://semantic-ui.com/images/avatar2/large/kristy.png'
								/>
							)}

							<Item.Content>
								<Item.Description floated='right'>
									<Header>Talent snapshot</Header>
									<Header sub>Current Employer</Header>
									<div>{profile.currentEmployment}</div>
									<Header sub>Visa Status</Header>
									<span>{profile.visa}</span>
									<Header sub>Position</Header>
									<span>{profile.level}</span>
								</Item.Description>
							</Item.Content>
						</Item>
					</Card.Content>
				)}

				<Card.Content>
					<Grid columns={4}>
						<Grid.Row>
							<Grid.Column>
								{this.state.showVideo ? (
									<Icon
										onClick={this.closeVideo}
										name='user'
										size='large'
									></Icon>
								) : (
									<Icon
										name='video'
										onClick={this.openVideo}
										size='large'
									></Icon>
								)}
							</Grid.Column>
							<Grid.Column>
								<Icon name='file pdf' size='large'></Icon>
							</Grid.Column>
							<Grid.Column>
								<Link
									to={{ pathname: "https://www.linkedin.com" }}
									target='_blank'
								>
									<Icon name='linkedin' size='large'></Icon>
								</Link>
							</Grid.Column>
							<Grid.Column>
								<Link
									to={{ pathname: "https://www.github.com" }}
									target='_blank'
								>
									<Icon name='github' size='large'></Icon>
								</Link>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card.Content>
				<Card.Content extra>
					{profile.skills.length ? (
						profile.skills.map((skill) => (
							<Button basic color='blue' key={skill} content={skill} />
						))
					) : (
						<Button basic color='blue' content='No Skills' />
					)}
				</Card.Content>
			</Card>
		);
	}
}
