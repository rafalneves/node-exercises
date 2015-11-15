var IndexPage = React.createClass({
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
                title="Add Note"
                note={{ title: "asdasd" }}></window.noteFormModal>
        );
        return <div>
            <header style={{ backgroundColor: "#000", color: "#FFF", textAlign: "right", padding: "5px 10px" }}>
                <span>Hi, {this.props.user.name} <i style={{ cursor: "pointer" }} className="fa fa-external-link-square" onClick={this.logout}></i></span>
            </header>
            <div className="container">
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-sm-9">
                        there
                    </div>
                    <div className="col-sm-3">
                        <button type="button" className="btn btn-sm btn-link" onClick={this.openModal}>Add Note</button>
                    </div>
                </div>
            </div>
            {modal}
        </div>
    },
    openModal: function(){
        this.refs.modal.open();
    },
    closeModal: function(){
        this.refs.modal.close();
    },
    addNote: function(){
        $.ajax({
            url: "/auth.json",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify({
                hash: $.md5(authData.username + $.md5(authData.password))
            }),
            dataType: "json",
            success: function(response, textStatus, jqXHR){
                this.refs.modal.close();
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