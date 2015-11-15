var noteFormModal = React.createClass({
	componentDidMount: function() {
		$(this.refs.root).modal({backdrop: 'static', keyboard: false, show: false});
	},
	componentWillUnmount: function() {
		$(this.refs.root).off('hidden', this.handleHidden);
	},
	close: function() {
		$(this.refs.root).modal('hide');
	},
	open: function(){
		$(this.refs.root).modal('show');
	},
	render: function() {
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
								<h3>{this.props.title}</h3>
							</div>
							<div className="modal-body">
								<div className="row">
									<div className="col-sm-4 form-group">
										<label className="control-label" htmlFor="title">Title:</label>
									</div>
									<div className="col-sm-8">
										<input id="title" type="text" className="form-control input-sm" placeholder="Write your note title" value={this.props.note.title} onChange={this.titleChange} required />
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4 form-group">
										<label className="control-label" htmlFor="body">Note:</label>
									</div>
									<div className="col-sm-8">
										<textarea id="body" type="text" className="form-control input-sm" placeholder="Write your note title" rows="8" value={this.props.note.body} required></textarea>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-sm btn-default" onClick={this.handleCancel}>Cancel</button>
								<button type="submit" className="btn btn-sm btn-success">Add Note</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	},
	titleChange: function(e){
		this.props.edit_note.title = e.target.value;
	},
	handleCancel: function() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	},
	handleConfirm: function() {
		if (this.props.onConfirm) {
			this.props.onConfirm();
		}
	}
});
window.noteFormModal = noteFormModal;