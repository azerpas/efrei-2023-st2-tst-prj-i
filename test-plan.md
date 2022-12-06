| N° | Entity        | Date | Description                                                            | Expected result                                                               | Validated                                  |
| -- | ------------- | ---- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ |
| 1  | Employee      |      | Create an employee                                                     | We should find this same employee in the list of employees.                   | Yes                                        |
| 2  | Employee      |      | Input should be filtering types (numeric, letters, special characters) | Number input should not accept strings                                        | No (Zip code field accept negative values) |
| 3  | Employee      |      | Form should be expecting required inputs                               | The form should not create the entity if a required input is empty yet.       | Yes                                        |
| 4  | Employee      |      | Server should check for unique field (email)                           | Using the same email twice should result in an error                          | No (should not be accepted)                |
| 5  | Employee      |      | Data should be saved according to form fields                          | When listing employees after a creation, data should be the same as the given |                                            |
| 6  | Employee      |      | Should be able to be promoted as manager                               | Employee appears as manager                                                   | Yes                                        |
| 7  | Employee      |      | Should be able to be added to a team                                   | Employee should appear in team members list                                   | Yes                                        |
| 8  | Employee      |      | Should be able to be deleted                                           | Employee should be removed from employee list                                 | Yes                                          |
| 9  | Employee      |      | Shouldn’t be able to modify employee contract                          | Contract property should be locked to modifications                           |                                            |
| 10 | Team          |      | Create a team                                                          | We should find this same team in the list of teams                            |                                            |
| 11 | Team          |      | Form should be expecting required input                                | The form should not create the entity if a required input is empty yet        |                                            |
| 12 | Team          |      |                                                                        |                                                                               |                                            |
| 13 | Team,Employee |      | Delete a team                                                          | The team should be deleted from the list.                                     |                                            |
| 14 | Team          |      | Delete a team                                                          | Every employees of the team should not have this team anymore.                |                                            |
| 15 | Employe,Team  |      | Delete an employee                                                     | The employee should be removed from all the teams                             |                                            |
| 18 | Team          |      | Reset database                                                         | List of team should be empty and display “No employees yet”                   |                                            |
| 19 | Employee      |      | Reset database                                                         | List of employee should be empty                                              |                                            |


## Questions / specs not explicit : 

- An employee can be a part of severals teams ?

- A team can contain various managers ?

- An employee that is manager can be a manager for other teams ? 

 