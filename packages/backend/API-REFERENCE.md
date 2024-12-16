#### Community Connect - Backend

# API Reference

This is the API reference for the backend application of the Community Connect Project.

## INDEX (V1)

1. Authentication
2. Users
3. [Mentors](#mentors)


## Mentors

### URL: API_URL/mentors

<details>
  <summary>Find all mentor applications</summary>

  #### Method: **GET**
  #### Body: (Optional filters):
  ```Typescript
  {
    "max_mentees": Int,
    "has_experience": Boolean,
    "status": prisma.mentors_status [PENDING | APPROVED | REJECTED | SUSPENDED]
  }
  ```
  #### Return: mentors [ ] with users
</details>

<details>
  <summary>Find one by ID</summary>

  #### Params: /:mentorId
  #### Method: GET
  #### Return: mentor with users

</details>

<details>
  <summary>Create mentor application</summary>

  #### Method: POST
  #### Body:
  ```Typescript
  {
    "max_mentees": Integer,
    "availability": String,
    "has_experience": Boolean,
    "experience_details": String,
    "status": prisma.mentors_status [PENDING | APPROVED | REJECTED | SUSPENDED],
    "user_id": Integer
  }
  ```
  #### Return: mentor

</details>

<details>
  <summary>Edit mentor application</summary>

  #### Params: /:mentorId
  #### Method: PATCH
  #### Body: (optional params)
  ```Typescript
  {
    "max_mentees": Integer,
    "availability": String,
    "has_experience": Boolean,
    "experience_details": String
  }
  ```
  #### Return: mentor

</details>

<details>
  <summary>Update mentor status</summary>
  
  #### Params: /:mentorId
  #### Method: PUT
  #### Body:
  ```Typescript
  {
    "status": prisma.mentors_status [PENDING | APPROVED | REJECTED | SUSPENDED],
  }
  ```
  #### Return: mentor with users

  ---

  > **NOTE:** This method will also alternates the user role between "USER" and "MENTOR"

  ---

</details>