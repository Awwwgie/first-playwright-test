import {test, expect} from '@playwright/test';

test.describe('Add/Remove Elements Page', () => {
    test('Add/Remove Elements link works and page loads correctly', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/');
        await page.getByRole('link', {name: 'Add/Remove Elements'}).click();
        await expect(page).toHaveURL(/add_remove_elements/);
        await expect(page.getByRole('heading', {level: 3})).toContainText('Add/Remove Elements');
    })

    test('Clicking "Add Element" button adds a new element', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
        await page.getByRole('button', {name: 'Add Element'}).click();
        await expect(page.getByRole('button', {name: 'Delete'})).toBeVisible();
    })
    
    test('Clicking "Add Element" multiple times adds multiple elements', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Add Element'}).click();
    
        const deleteButtons = page.getByRole('button', {name: 'Delete'});
        await expect(deleteButtons).toHaveCount(3);
    });

    test('Clicking "Delete" button removes the element', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Delete'}).click();
        await expect(page.getByRole('button', {name:'Delete'})).not.toBeVisible();
    });

    test('"Delete" removes only one element when clicked once', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Add Element'}).click();
        
        await page.getByRole('button', {name: 'Delete'}).first().click();
        
        const deleteButtons = page.getByRole('button', {name: 'Delete'});
        await expect(deleteButtons).toHaveCount(2);
    });

    test('Clicking "Delete" on all Delete buttons removes all the elements', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
        await page.getByRole('button', {name: 'Add Element'}).click();
        await page.getByRole('button', {name: 'Add Element'}).click();

        const deleteButtons = page.getByRole('button', {name: 'Delete'});
        const count = await deleteButtons.count();

        for(let i=0; i<count; i++) {
            await deleteButtons.first().click();
        }
        await expect(page.getByRole('button', {name: 'Delete'})).not.toBeVisible();
    });

    // Random edge cases
    test('Rapid clicks on "Add Element" button', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

        const addButton = page.getByRole('button', {name: "Add Element"});

        for (let i=0; i < 10; i++) {
            await addButton.click();
        }

        const deleteButtons = page.getByRole('button', {name: "Delete"});
        await expect(deleteButtons).toHaveCount(10);
    });

    test('Unavailable rapid clicks on "Add Element" button', async ({page}) => {
        test.fail();
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

        const addButton = page.getByRole('button', {name: "Add Element"});

        for (let i=0; i < 10; i++) {
            await addButton.click();
        }

        const deleteButtons = page.getByRole('button', {name: "Delete"});
        await expect(deleteButtons).toHaveCount(1);
    });

    test('Staggered rapid clicks on "Add Element" button', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

        const addButton = page.getByRole('button', {name: "Add Element"});

        for (let i=0; i < 10; i++) {
            await addButton.click();
            await page.waitForTimeout(600);
        }

        const deleteButtons = page.getByRole('button', {name: "Delete"});
        await expect(deleteButtons).toHaveCount(10);
    });

    test('Adding X elements WITHOUT breaking', async ({page}) => {

        test.setTimeout(0);

        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

        for(let i=0; i < 1000; i++) {
            await page.getByRole('button', {name: 'Add Element'}).click();
        }

        const deleteButtons = page.getByRole('button', {name:'Delete'});
        await expect(deleteButtons).toHaveCount(1000);
    });

    test('Correct state after multiple add/remove', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

        for(let i = 0; i < 10; i++) {
            await page.getByRole('button', {name: 'Add Element'}).click();
        }

        for (let i = 0; i < 4; i++) {
            await page.getByRole('button', {name: 'Delete'}).first().click();
        }

        const deleteButtons = page.getByRole('button', {name: 'Delete'});
        await expect(deleteButtons).toHaveCount(6);

        for(let i = 0; i < 2; i++) {
            await page.getByRole('button', {name:'Add Element'}).click();
        }

        await expect(deleteButtons).toHaveCount(8);
    }) 
});