Repository reserved to candidates taking the programming test for the open position of "full stack developer" at Kopjra Srl.
In order to complete the test, 4 hours (est.) are needed.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

1. Fork this repository;
1. Do the exercise of your choice, following both common and specific directives;
1. If you have any question, feel free to ask mailing to your contact person or careers@kopjra.com;
1. Following the completion of the excercise, open a pull request: please note that there is no delivery deadline.

# Common directives

You MUST include a plaintext/markdown file (INSTRUCTIONS.md) that lists all the shell commands required to make your application work, including all the additional hypotheses on the underlying environment and business requirements (those SHOULD be as few as possible).

The front-end MUST be a Single Page Application built in React and it MUST consume the RESTful APIs of your back-end.
For the basic templating you SHOULD use Bootstrap. You MAY use Gulp for the automated building process.

The back-end MUST expose RESTful APIs and it MUST be built in Javascript using Node.js on the Express 4 framework.
Instead of using a database, every interaction with the persistance layer SHOULD be mocked properly.
All the back-end calls MUST accept just an `application/json` and MUST respond with the same content type.

You MAY serve static content through Express. You SHOULD NOT pre-render HTML through the back-end.

You MAY manage user creation; otherwise just provide a set of users.
Choose your preferred authentication and authorisation model.

# Exercise 1

Build a simple notekeeping website.

## Business requirements

1. Every user can create, edit and delete any amount of notes;
1. Notes are secret (ie: accessible only to the creator);
1. Notes contain a title, a body and the creation date;
1. Notes can be tagged;
1. Every user can create, edit and delete any amount of tags;
1. Tags are secret;
1. Tags contain just the name of the tag; 
1. Users can list their notes and tags;
1. Users can browse their notes by tag and creation date.

# Exercise 2

Build a simple online food ordering application for a restaurant.

## Business requirements

1. Every regular user can place any amount of orders;
1. Every order must contain at least a course;
1. A course contains a title, a body and a price;
1. The administrator can create, edit and delete any amount of courses;
1. The administrator can list the orders;
1. The administrator can view the details of an order;
1. Payment is cash only on delivery.
