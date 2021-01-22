# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["TinyApp"](https://github.com/tmslee/tinyapp/blob/master/docs/urls-page.png)

-----------------------------------------------------------------------------

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override
- morgan

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Web server should be accessible at localhost:8080 from your machine
- Access port can be changed at line 28 of express_server.js

<br>

# Features

## User Registration and Authentication

!["Log in page"](https://github.com/tmslee/tinyapp/blob/master/docs/login-page.png)

-----------------------------------------------------------------------------

- TinyApp allows full access to its url shortening features to registered users

-----------------------------------------------------------------------------

!["Register page](https://github.com/tmslee/tinyapp/blob/master/docs/register-page.png)

-----------------------------------------------------------------------------



- Registration requires a new user ID and email that has not been registered with the app previously

- Password is hashed and cookies are encrypted for secure user experience

- Once registered, users have access to a personalized "database" of short urls they can access, create, edit, or delete.

## Url Shortening, Editing and Deleting

![urls page](https://github.com/tmslee/tinyapp/blob/master/docs/urls-page.png)

-----------------------------------------------------------------------------
- Users have access to all the short urls they have created

- Once created anyone can use the short url as a link to its corresponding url

- Users can edit, delete, and view (the details) only the url that they have created

-----------------------------------------------------------------------------

![url edit page](https://github.com/tmslee/tinyapp/blob/master/docs/url_show-page.png)

-----------------------------------------------------------------------------

- Each short url keeps track of which user has accessed it when

  - Clicking edit on a short url will reveal visit counts, number of unique visits, and a full log of visit times by a certain user

  - The log will display a 'visitor' id if there was no associated TinyApp user ID to the visitor

## Error Page

- when trying to access routes without permission or when the app is provided with bad input, the app will redirect the user to an error page displaying a relevant error message as such:

-----------------------------------------------------------------------------

![error page](https://github.com/tmslee/tinyapp/blob/master/docs/error-page.png)