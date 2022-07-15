# Communication

## Task Description
The main logic of the application - one user can ask a question to another user, and answer the questions asked to him.
Application will consist of 8 main parts:
#### 1) Login page (example)
![Login example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Login(example).png)

#### 2) Registration page (example)
![Registration example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Registration(example).png)

#### 3) Edit Profile page (example)
![Edit Profile example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Edit%20user(example).png)

#### 4) Delete Profile page (example)
![Delete Profile example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Delete%20user(example).png)

#### 5) Question Table (example)
Here will be listed all questions that user creates for another users. User will be able to create, edit, delete questions. List entry has the next fields:
- Question – question string;
- Answer type – enumeration (single line text, multiline text, radio button, checkbox,
combobox, date);
- For user – email of user for whom the question was asked;
- Answer – string representation of answer (if an answer from another user has already been received, empty otherwise).
Please note:
- The answer should be automatically deleted when editing / deleting the question;
- The list should be dynamically updated (using websockets) when receiving an answer
to some question.
![Question Table example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Question%20table(example).png)

#### 6) Answer Table (example)
On this page user can see all questions that came from other users. User will be able to click edit button and answer question (or edit existing answer). List entry has next fields:
- From user – email of the user who asked the question;
- Question – question string;
- Answer – string representation of answer (if the user has already answered the question, empty otherwise).
Please note:
- The questions list should be automatically updated (using websockets) when some
question was added or edited / deleted.
![Answer Table example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Answer%20table(example).png)

#### 7) Add/Edit Question Modal (example)
Here user will be able to create or edit questions.
![Question Modal example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Add%20question(example).png)

#### 8) Answer/Edit answer Modal (example)
Using this dialog, the user can answer the question or edit an existing answer. The type of the field for the answer must match the type of the field in the question. For example, if question has answer type = date, then the field should look like datepicker (and so on). “From user” and “Question” fields should be read only.
![Answer Modal example](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Answer%20the%20question(example).png)

## Documentation
[JavaDoc](https://foltrex.github.io/Coomunication/)


## Source Code
[Pull Request](https://github.com/Foltrex/Coomunication/pull/1)


## Images (real images of app, not from examples)

### 1. Login Page
![Login](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Login.png)

### 2. Registration Page
![Registration](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Registration.png)

### 3. Question Table
![Question Table](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Question%20table.png)

### 4. Question Modal (Add question)
![Add question modal](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Add%20question.png)

### 5. Question Modal (Edit question)
![Edit question modal](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Edit%20the%20question.png)

### 6. Answer Table
![Answer Table](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Answer%20table.png)

### 7. Answer Modal (Edit answer)
![Edit answer modal](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Answer%20the%20question.png)

### 8. Edit user
![Edit user](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Edit%20user.png)

### 9. Delete user
![Delete user](https://github.com/Foltrex/Coomunication/blob/gh-pages/assets/Delete%20user.png)