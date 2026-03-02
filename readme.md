# fixcho
React Native Course Project 

## Link to APK //TODO
https://drive.google.com/file/d/1ZliHOsSJzk4G6tZ4-BGkVEmmtsxnyqs8/view?usp=sharing

## Walkthrough Tutorial (optional)
*give simple directions on how to navigate, login and use the main app features*

## Installation Guide
Im using: 
- Expo Go SDK55!
for starting the app i use: npx expo start

## Functional Guide
1. Project Overview
 - *Application Name*: **Fixcho**
 - *Application Category / Topic*: **Services**
 - *Main Purpose*: **People posting jobs that need to get done, so specialist/professional could reach them**
---
2. User Access & Permissions
- Guest (Not Authenticated):
- They can access only login and register screens!
- Authenticated User:
- Authenticated User that has finished the onboarding screen can access the two main tabs Home(index) and Profile.Then he has access to details screen of the jobs, edit job screen if he is the creator, also create job screen and edit profile screen (user could not go to onboarding screen after completing it once! if the user has not completed the onboarding, it could not continue to main screen!).
---
3. Authentication & Session Handling
- Authentication Flow
- Explain step-by-step: 
1. What happens when the app starts: 
-it loads the login screen. 
2. How authentication status is checked: 
- auth status is checked in AuthContext by the method checkSession, which gets the session via supabase. 
3. What happens on successful login or registration: 
- it gets the user from supabase and sets it in the AuthContext to be used.
4. What happens on logout: 
- it calls the function signOut() from supabase and removes the user from the context.
- Session Persistence
* How is the user session stored? 
- in AuthContext.
* How is automatic login handled after app restart? 
- every time, i call checkSession which calls getSession from supabase and if there is active session, it sets the user in the context.
---
4. Navigation Structure
Root Navigation Logic
* How is navigation split between authenticated and unauthenticated users? 
- navigation is split by a guard that i have in the main _layout file, that doesn't allow unauthenticated to access screens other than those is (auth) folder.
- Main Navigation
- Describe the main navigation structure: 
- Number and type of main sections (e.g. Tabs) - i have 2 main tabs:index(home) and profile.
- Nested Navigation
* Is there nested navigation (e.g. Stack inside a Tab)? 
- Yes, there is, the add job,details and edit profile screens are all nested stacks inside the tab.
* What type of screens are included? 
- Authentication, List/Feed, Details, Edit, Create
5. List → Details Flow
- List / Overview Screen
* What type of data is displayed? 
- jobs uploaded by people.
* How does the user interact with the list? 
- users can click on the list items and they will be redirected to details screen
- Details Screen.
* How is navigation triggered? 
- by click, with react-router.
* What data is received via route parameters? 
- job id.
---
6. Data Source & Backend
- Backend Type
* Simulated backend (MockAPI / DummyJSON)
* Real backend (Firebase or equivalent) 
- yes, i use Supabase for my backend.
---
7. Data Operations (CRUD)
- Describe the implemented data operations:
- Read (GET)
* Where is data fetched and displayed? 
- Data is fetched from Supabase inside the custom hook useJobs. its displayed in home screen, profile screen and job details screen.
- Create (POST)
* How does the user create new data? 
- he user creates new jobs from the Add Job screen. From there it can insert data into supabase using upabase.from("jobs").insert(...).
- Update / Delete (Mutation)
* Which operation is implemented (Update and/or Delete)? 
- i use update, that changes isActive of the data
* How is the UI updated after the change? 
- after the CRUD methods is called - refreshJobs().
---
8. Forms & Validation
- Forms Used
---
9. List all forms in the application:
-Login Form: Email, Password
-Onboarding / Sign Up Form: Full Name, Username, Location, Phone, NumberRole, selection (User / Professional),Profile Image upload
-Add Job Form: Title, Category, Description, Location, Negotiable toggle, Minimum Price, Maximum Price, Contact Name, Email, Phone Number, Job Image upload
-Edit Job Form: Same fields as Add Job Pre-filled with existing job data
-Edit Profile Form: Full Name, Username, Location, Phone Number, Role, Profile Image

- Validation Rules
- Describe at least three validated fields: - Field name and rules: - Field name and rules: - Field name with multiple validation rules:
- Username: Required field, Must be at least 3 characters,Must be unique (checked against database)
- Phone Number: Must match valid phone pattern with regex validation
- Job Title: Required, Must be at least 6 characters, Cannot contain only whitespace, Trimmed before submission
---
1.  Native Device Features
- I have used Camera/ Image Picker multiple times in my project, its for profile and job pictures.

---
1.  Typical User Flow
- User runs the app, clicks on sign up, goes throught onboarding and after that he is redirected to the main screen, he can look at the jobs posted by other users or he can create his own, he can edit it if something is wrong, he can edit his profile also.
---
1.  Error & Edge Case Handling
- Every error is handled by Alerts so the user expirience is on good level.
---




## Markdown CheatSheet
[Link to cheatsheet](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet)