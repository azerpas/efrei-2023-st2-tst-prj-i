import { test, expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { ListTeamsDevPage } from './teams/list-teams-dev-page'
import { CreateTeamDevPage } from './teams/create-team-dev-page'
import { ListEmployeeDevPage } from './employee/list-employees-dev-page'
import { CreateEmployeeDevPage } from './employee/create-employee-dev-page'
import { Employee } from '@models/Employee'

test.beforeEach(async () => {
    const res = await fetch('https://i.hr.dmerej.info/reset_db', {
        method: 'POST'
    })
    test.fail(res.ok === false, 'Failed to reset database')
})


// All tests related to the 'Employees'
test.describe('Employees', () => {

    test('has no employees at the beginning', async ({ page }) => {
        const listEmployeesDev = new ListEmployeeDevPage(page);
        await listEmployeesDev.goto();

        await expect(listEmployeesDev.page).toHaveTitle(/Employees/);

        const body = await listEmployeesDev.page.$('body');
        const text = await body?.textContent();

        expect(text).toContain('No employees yet.');
    })

    const createOneEmployee = async (page: Page) => {
        const createEmployeeDev = new CreateEmployeeDevPage(page);
        await createEmployeeDev.goto();

        await expect(createEmployeeDev.page).toHaveTitle(/Add Employee/);
        const date = faker.date.between('2010-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z');
        const name = faker.name.firstName();
        const email = faker.internet.email();

        await createEmployeeDev.createEmployee(new Employee(
            name,
            email,
            faker.address.country(),
            faker.address.cityName(),
            faker.address.cityName(),
            faker.address.zipCode(),
            date.toISOString().slice(0, 10),
            faker.name.jobTitle()
        ));
        const listEmployeeDev = new ListEmployeeDevPage(page);

        expect(await listEmployeeDev.getEmployeesInformations()).toContain(name);
        expect(await listEmployeeDev.getEmployeesInformations()).toContain(email);

    }

    // Test 1
    test('create an employee should add in the list of employees', async ({ page }) => {
        const createEmployeeDev = new CreateEmployeeDevPage(page);
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());
        const listEmployeeDev = new ListEmployeeDevPage(page);
        const nbEmployees = await listEmployeeDev.getNbEmployees();

        expect(nbEmployees).toEqual(1);
    })

    // Test 5
    test('can create one employee with proper informations', async ({ page }) => {
        await createOneEmployee(page);
    })

    // Test 8
    test('Delete an employee should delete it from the list of employees.', async ({ page }) => {
        const createEmployeeDev = new CreateEmployeeDevPage(page);
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());

        const listEmployeeDev = new ListEmployeeDevPage(page);
        const employeeID = parseInt(await listEmployeeDev.deleteButton.getAttribute("href").then((data) => data?.split('/')[3]) as string);
        await listEmployeeDev.deleteEmployee(employeeID);
        const nbEmployees = await listEmployeeDev.getNbEmployees();

        expect(nbEmployees).toEqual(0);
    })

    // Test 17
    test('Reset database should delete all employees from the list of employees', async ({ page }) => {
        const createEmployeeDev = new CreateEmployeeDevPage(page);
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());
        await createEmployeeDev.goto();
        await createEmployeeDev.createEmployee(await createEmployeeDev.generateRandomEmployee());


        const listEmployeeDev = new ListEmployeeDevPage(page);

        const nbEmployeesBeforeResetDB = await listEmployeeDev.getNbEmployees();
        expect(nbEmployeesBeforeResetDB).toEqual(5);

        await listEmployeeDev.resetDatabase();
        const nbEmployeesAfterResetDB = await listEmployeeDev.getNbEmployees();
        expect(nbEmployeesAfterResetDB).toEqual(0);

    })


})

test.describe('Teams', () => {
    test.beforeEach(async () => {
        const res = await fetch('https://i.hr.dmerej.info/reset_db', {
            method: 'POST'
        })
        test.fail(res.ok === false, 'Failed to reset database')
    })
    // test 12
    test('has no team at the beginning', async ({ page }) => {
        const listTeamsDev = new ListTeamsDevPage(page);
        await listTeamsDev.goto();
        await expect(listTeamsDev.page).toHaveTitle(/Teams/);

        const body = await listTeamsDev.page.$('body');
        const text = await body?.textContent();
        const nbTeams = await listTeamsDev.getNbTeams();
        expect(nbTeams).toEqual(0);
        expect(text).toContain('No teams yet')
    })

    // test 10
    test('create a team should add in the list of teams', async ({ page }) => {
        const createTeamsDev = new CreateTeamDevPage(page);
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("test");
        const listTeamsDev = new ListTeamsDevPage(page);
        const nbTeams = await listTeamsDev.getNbTeams();
        expect(nbTeams).toEqual(1);
    })

    // test 10
    test('create a team should add in the list of teams with good name', async ({ page }) => {
        const createTeamsDev = new CreateTeamDevPage(page);
        await createTeamsDev.goto();
        const teamName = faker.company.name();
        await createTeamsDev.createTeam(teamName);
        const listTeamsDev = new ListTeamsDevPage(page);
        const nbTeams = await listTeamsDev.getNbTeams();
        expect(nbTeams).toEqual(1);
        expect(await listTeamsDev.getTeamsInformations()).toContain(teamName);
    })

    // test 22
    test('create a team with the same name as another team should not work', async ({ page }) => {
        const createTeamsDev = new CreateTeamDevPage(page);
        await createTeamsDev.goto();
        const teamName = faker.company.name();
        await createTeamsDev.createTeam(teamName);

        await expect(createTeamsDev.page).toHaveTitle("HR DB - HR DB - Teams");

        await createTeamsDev.goto();
        await createTeamsDev.createTeam(teamName);

        await expect(createTeamsDev.page).toHaveTitle("HR DB - HR DB - Add Team");
        expect(await createTeamsDev.getErrorMessage()).toEqual("a team with the same name already exists");

    })

    // test 13
    test('Delete a team should delete it from the list of teams.', async ({ page }) => {
        const createTeamsDev = new CreateTeamDevPage(page);
        await createTeamsDev.goto();
        const teamName = faker.company.name();
        await createTeamsDev.createTeam(teamName);
        const listTeamsDev = new ListTeamsDevPage(page);
        const teamID = parseInt(await page.locator("a.btn.btn-danger").getAttribute("href").then((data) => data?.split('/')[3]) as string);
        await listTeamsDev.deleteTeam(teamID);
        const nbTeams = await listTeamsDev.getNbTeams();

        expect(nbTeams).toEqual(0);
    })

    // Test 16
    test('Reset database should delete all teams from the list of teams', async ({ page }) => {
        const createTeamsDev = new CreateTeamDevPage(page);
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("team1");
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("team2");
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("team3");
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("team4");
        await createTeamsDev.goto();
        await createTeamsDev.createTeam("team5");

        const listTeamsDev = new ListTeamsDevPage(page);

        const nbTeamsBeforeResetDB = await listTeamsDev.getNbTeams();
        expect(nbTeamsBeforeResetDB).toEqual(5);

        await listTeamsDev.resetDatabase();
        const nbTeamsAfterResetDB = await listTeamsDev.getNbTeams();
        expect(nbTeamsAfterResetDB).toEqual(0);

    })

})
