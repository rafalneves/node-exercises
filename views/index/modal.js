var noteFormModal = React.createClass({
	getInitialState: function(){
		return { noteid: null, title: null, body: null, datetime: null, userid: null};
	},
	componentDidMount: function(){
		$(this.refs.root).modal({backdrop: 'static', keyboard: false, show: false});
	},
	componentWillUnmount: function(){
		$(this.refs.root).off('hidden', this.handleHidden);
	},
	close: function(){
		this.replaceState(this.getInitialState());

		$(this.refs.root).modal('hide');
	},
	open: function(note){
		this.setState(note);

		$(this.refs.root).modal('show');
	},
	render: function(){
		return (
			<div className="modal fade" ref="root">
				<div className="modal-dialog">
					<div className="modal-content">
						<form name="note" onSubmit={this.onSubmit}>
							<div className="modal-header">
								<button
									type="button"
									className="close"
									onClick={this.handleCancel}>
									&times;
								</button>
								<h3>Note</h3>
							</div>
							<div className="modal-body">
								<div className="row">
									<div className="col-sm-4 form-group">
										<label className="control-label" htmlFor="title">Title:</label>
									</div>
									<div className="col-sm-8">
										<input id="title" type="text" className="form-control input-sm" placeholder="Write your note title" value={this.state.title} onChange={this.handleChange.bind(this, "title")} required />
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4 form-group">
										<label className="control-label" htmlFor="body">Note:</label>
									</div>
									<div className="col-sm-8">
										<textarea id="body" type="text" className="form-control input-sm" placeholder="Write your note body" rows="8" value={this.state.body} onChange={this.handleChange.bind(this, "body")} required></textarea>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-sm btn-default" onClick={this.handleCancel}>Cancel</button>
								<button type="submit" className="btn btn-sm btn-success">Save</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	},
	handleChange: function(field, e){
		var nextState = {};
		nextState[field] = e.target.value;
		this.setState(nextState);
	},
	handleCancel: function(){
		this.close();
	},
	onSubmit: function(e){
		e.preventDefault();

		var reactClass = this;
		$.ajax({
			url: "/note.json",
			contentType: "application/json",
			type: this.state.noteid ? "put" : "post",
			data: JSON.stringify(this.state),
			dataType: "json",
			success: function(response, textStatus, jqXHR){
				reactClass.close();

				reactClass.props.update();
			}
		});
	}
});
window.noteFormModal = noteFormModal;