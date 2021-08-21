//chnaged file
import React from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import TalentCardDetail from "../TalentFeed/TalentCardDetail.jsx";

export default class TalentCard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return this.props.profiles.length === 0 ? (
			<div>
				<h4>There ase no talents found for your recuitment company</h4>
			</div>
		) : (
			this.props.profiles.map((profile) => (
				<TalentCardDetail key={profile.id} profile={profile} />
			))
		);
	}
}
