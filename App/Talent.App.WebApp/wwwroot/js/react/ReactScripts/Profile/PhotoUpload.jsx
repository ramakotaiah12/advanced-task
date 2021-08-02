/* Photo upload section 
chnaged file*/
import React, { Component } from "react";
import Cookies from "js-cookie";
import { Image, Icon } from "semantic-ui-react";
import axios from "axios";

export default class PhotoUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showPreviewSection: false,
			file: null,
			imageFile: null,
		};
		this.handleChange = this.handleChange.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
	}
	handleUpload(event) {
		event.preventDefault();
		const formData = new FormData();
		formData.append("talentPhoto", this.state.imageFile);
		var cookies = Cookies.get("talentAuthToken");

		$.ajax({
			url: this.props.savePhotoUrl,
			headers: {
				Authorization: "Bearer " + cookies,
			},
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				if (res.success === true) {
					TalentUtil.notification.show(`${res.message}`, "success", null, null);
				} else {
					TalentUtil.notification.show(
						`${res.data.message}`,
						"error",
						null,
						null
					);
				}
				window.location.reload();
			},
		});
	}
	handleChange(event) {
		this.setState({
			file: URL.createObjectURL(event.target.files[0]),
			imageFile: event.target.files[0],
			showPreviewSection: true,
		});
	}

	renderDisplay() {
		const imgSrc = this.props.imageId
			? this.props.imageId
			: "../../../../images/camera.png";
		return (
			<React.Fragment>
				<div
					onClick={() => {
						this.upload.click();
					}}
				>
					<Image
						src={imgSrc}
						style={{
							width: 150,
							height: 150,
							borderRadius: 150 / 2,
							overflow: "hidden",
							borderWidth: 3,
							borderColor: "red",
						}}
					/>
				</div>
				<input
					id='myInput'
					type='file'
					ref={(ref) => (this.upload = ref)}
					style={{ display: "none" }}
					onChange={this.handleChange}
				/>
			</React.Fragment>
		);
	}
	renderPreview() {
		return (
			<React.Fragment>
				<div style={{ textAlign: "center" }}>
					{" "}
					<Image
						src={this.state.file}
						style={{
							width: 150,
							height: 150,
							borderRadius: 150 / 2,
							overflow: "hidden",
							borderWidth: 3,
							borderColor: "red",
						}}
					/>
					<br />
					<button className='ui teal button' onClick={this.handleUpload}>
						<Icon name='upload' size='small' />
						Upload
					</button>{" "}
				</div>
			</React.Fragment>
		);
	}

	render() {
		return this.state.showPreviewSection
			? this.renderPreview()
			: this.renderDisplay();
	}
}
