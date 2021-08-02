//chnaged file
import React from "react";
import { Image, Card, Icon, Feed } from "semantic-ui-react";

export default class FollowingSuggestion extends React.Component {
	render() {
		return (
			<Card>
				<Card.Content>
					<Card.Header>Follow Talent</Card.Header>

					{this.props.profiles.map((profile) => (
						<Feed key={profile.id}>
							<Feed.Event>
								<Feed.Content>
									{profile.photoId ? (
										<Image
											src={profile.photoId}
											style={{
												width: 50,
												height: 50,
												borderRadius: 50 / 2,
												overflow: "hidden",
												borderWidth: 3,
												borderColor: "red",
											}}
										/>
									) : (
										<Image
											style={{
												width: 50,
												height: 50,
												borderRadius: 50 / 2,
												overflow: "hidden",
												borderWidth: 3,
												borderColor: "red",
											}}
											src='http://semantic-ui.com/images/avatar/small/jenny.jpg'
										/>
									)}
								</Feed.Content>

								<Feed.Content>
									<Feed.Summary>{profile.name}</Feed.Summary>
									<button className='ui primary basic button'>
										<i className='icon user'></i>Follow
									</button>
								</Feed.Content>
							</Feed.Event>
						</Feed>
					))}
				</Card.Content>
			</Card>
		);
	}
}
