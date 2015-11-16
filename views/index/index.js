var IndexPage = React.createClass({
    getInitialState: function(){
        return { data: new Array() };
    },
    componentDidMount: function(){
        $.get("/notes.json", function(result){
            if(this.isMounted()){
                this.setState(result);
            }
        }.bind(this));
    },
    logout: function(){
        $.ajax({
            url: "/auth.json",
            contentType: "application/json",
            type: "delete",
            data: {},
            dataType: "json",
            complete: function(){
                $.removeCookie("tAuth", { path: "/" });
                window.location.reload();
            }
        });
    },
    render: function(){
        var modal = null;
        modal = (
            <window.noteFormModal
                ref="modal"
                update={this.update}></window.noteFormModal>
        );
        return <div>
            <header style={{ backgroundColor: "#000", color: "#FFF", textAlign: "right", padding: "5px 10px" }}>
                <span>Hi, {this.props.user.name} <i style={{ cursor: "pointer" }} className="fa fa-external-link-square" onClick={this.logout}></i></span>
            </header>
            <div className="container">
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-sm-9">
                        <Notes data={this.state.data} edit={this.edit} remove={this.remove} tag={this.tag} removeTag={this.removeTag} />
                    </div>
                    <div className="col-sm-3">
                        <button type="button" className="btn btn-sm btn-link" onClick={this.openModal.bind(null, {})}>Add Note</button>
                    </div>
                </div>
            </div>
            {modal}
        </div>
    },
    openModal: function(note){
        this.refs.modal.open(note);
    },
    update: function(){
        $.get("/notes.json", function(result){
            this.setState(result);
        }.bind(this));
    },
    edit: function(noteId){
        var note = null;
        for(var i = 0; i < this.state.data.length; i++)
            if(this.state.data[i].noteid == noteId){
                note = this.state.data[i];

                break;
            }

        this.openModal(note);
    },
    remove: function(noteId){
        var notes = this.state.data;
        var newNotes = notes.filter(function(item){
            return item.noteid != noteId;
        });

        this.setState({data: newNotes});

        $.ajax({
            url: "/note.json",
            contentType: "application/json",
            type: "delete",
            data: JSON.stringify({ noteid: noteId }),
            dataType: "json"
        });
    },
    tag: function(noteId, e){
        if(e.keyCode == 13){
            var reactClass = this;
            $.ajax({
                url: "/note/tag.json",
                contentType: "application/json",
                type: "post",
                data: JSON.stringify({noteid: noteId, tag: e.target.value}),
                dataType: "json",
                success: function(response, textStatus, jqXHR){
                    e.target.value = null;
                    reactClass.update();
                }
            });
        }
    },
    removeTag: function(tag, noteId){
        for(var i = 0; i < this.state.data.length; i++)
            if(this.state.data[i].noteid == noteId){
                for(var y = 0; y < this.state.data[i].tags.length; y++){
                    if(this.state.data[i].tags[y].tag == tag){
                        this.state.data[i].tags.splice(y, 1);

                        break;
                    }
                }
                break;
            }
        this.setState({data: this.state.data});

        $.ajax({
            url: "/note/tag.json",
            contentType: "application/json",
            type: "delete",
            data: JSON.stringify({noteid: noteId, tag: tag}),
            dataType: "json"
        });
    }
});
var Notes = React.createClass({
    render: function() {
        var remove = this.props.remove, edit = this.props.edit, tag = this.props.tag, removeTag = this.props.removeTag;
        return (<div>
            { this.props.data.map(function(item) {
                    return <article key={item.noteid}>
                        <header>
                            <h3>{item.title}</h3>
                            <div style={{float: "right"}}>
                                <i style={{cursor: "pointer", padding: "3px"}} className="fa fa-pencil-square-o" onClick={edit.bind(null, item.noteid)}></i>
                                <i style={{cursor: "pointer", padding: "3px"}} className="fa fa-trash-o" onClick={remove.bind(null, item.noteid)}></i>
                            </div>
                        </header>
                        <div>{item.body}</div>
                        <footer>
                            <div>{item.datetime}</div>
                            <div className="row">
                                <div className="col-sm-10">
                                    <Tags tags={item.tags} removeTag={removeTag} noteid={item.noteid} />
                                </div>
                                <div className="col-sm-2 col-sm-offset-10">
                                    <input type="text" className="form-control input-sm" placeholder="Tag" onKeyUp={tag.bind(this, item.noteid)} />
                                </div>
                            </div>
                        </footer>
                    </article>
                })
            }
        </div>);
    }
});
var Tags = React.createClass({
    render: function() {
        var removeTag = this.props.removeTag, noteid = this.props.noteid;
        return (<span>
            { this.props.tags.map(function(item, index){
                    return <label key={index} style={{margin: "3px", fontSize: "11px"}} className="label label-warning">{item.tag} <i style={{cursor: "pointer", padding: "3px"}} className="fa fa-times" onClick={removeTag.bind(null, item.tag, noteid)}></i></label>
                })
            }
        </span>);
    }
});

var errorTemplate = React.createClass({
    render: function(){
        return <div className="row">
            <div className="col-sm-12">
                <div className="alert alert-danger" role="alert">
                    <div>
                        <span className="glyphicon glyphicon-exclamation-sign"></span>
                        <span className="sr-only">Error:</span>
                        <span>{this.props.error}</span>
                    </div>
                </div>
            </div>
        </div>
    }
});
var AuthForm = React.createClass({
    render: function(){
        var authData = {};
        return (
            React.createElement("div", {className: "container"},
                React.createElement("div", {className: "main"},
                    React.createElement("h1", {style: {"textAlign": "center"}}, "Autenticate"),
                    React.createElement("div", {className: "row"},
                        React.createElement("div", {className: "col-sm-4 col-sm-offset-4"},
                            React.createElement("form", {name: "auth", onSubmit: function(e){
                                        e.preventDefault();

                                        $.ajax({
                                            url: "/auth.json",
                                            contentType: "application/json",
                                            type: "post",
                                            data: JSON.stringify({
                                                hash: $.md5(authData.username + $.md5(authData.password))
                                            }),
                                            dataType: "json",
                                            success: function(response, textStatus, jqXHR){
                                                window.location.reload();
                                            },
                                            error: function(jqXHR, textStatus, errorThrown){
                                                switch(jqXHR.responseText){
                                                    case "WrongData":
                                                        ReactDOM.render(
                                                            React.createElement(errorTemplate, {
                                                                error: "Wrong login. Please try again."
                                                            }),
                                                            document.getElementById("error")
                                                        );
                                                        break;
                                                    default:
                                                        ReactDOM.render(
                                                            React.createElement(errorTemplate, {
                                                                error: "Unknown Error"
                                                            }),
                                                            document.getElementById("error")
                                                        );

                                                        break;
                                                }
                                            }
                                        });
                                    }
                                },
                                React.createElement("div", {className: "row"},
                                    React.createElement("div", {className: "form-group col-sm-4"},
                                        React.createElement("label", {
                                            htmlFor: "username",
                                            className: "control-label"
                                        }, "Username")
                                    ),
                                    React.createElement("div", {className: "col-sm-8"},
                                        React.createElement("input", {
                                            id: "username",
                                            type: "email",
                                            placeholder: "email@example.com",
                                            className: "form-control input-sm",
                                            required: true,
                                            onChange: function(e){
                                                authData.username = e.target.value;
                                            }
                                        })
                                    )
                                ),
                                React.createElement("div", {className: "row"},
                                    React.createElement("div", {className: "form-group col-sm-4"},
                                        React.createElement("label", {
                                            htmlFor: "password",
                                            className: "control-label"
                                        }, "Password")
                                    ),
                                    React.createElement("div", {className: "col-sm-8"},
                                        React.createElement("input", {
                                            id: "password",
                                            type: "password",
                                            placeholder: "Your password",
                                            className: "form-control input-sm",
                                            required: true,
                                            onChange: function(e){
                                                authData.password = e.target.value;
                                            }
                                        })
                                    )
                                ),
                                React.createElement("div", {id: "error"}),
                                React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary pull-right"}, "Login")
                            )
                        )
                   )
                )
            )
        );
    }
});

$.get("/user.json", function(data){
    ReactDOM.render(
        React.createElement(IndexPage, {
            user: data
        }),
        document.getElementById("wrapper")
    );
}).fail(function(){
    ReactDOM.render(
        React.createElement(AuthForm, {
            login: {}
        }),
        document.getElementById("wrapper")
    );
});