describe('Basic user flow for Website', () => {
    // Testing to see if there are initially 0 notes
    beforeAll(async () => {
      await page.goto('file:///Users/anirwinjain/Desktop/cse110-sp24-lab-6-vinnyteam/index.html');
    });

    it('Initial Home Page - Check for 0 Notes', async () => {
      console.log('Checking for 0 Notes...');
      const numNotes = await page.$$eval('.note', (noteItems) => {
        return noteItems.length;
      });
      expect(numNotes).toBe(0);
    });
    
    it('Adding 4 notes', async () => {
      console.log('Testing note creation..');
      for (let i = 0; i<4; i++)
      {
        await page.waitForSelector('.add-note', { visible: true });
        await page.click('.add-note');
      };
    });
    
    it('Checking that the number of notes is exactly 4', async () => {
      console.log('Verifying the number of notes...');
  
      const noteCount = await page.evaluate(() => {
        return document.querySelectorAll('.note').length;
      });

      expect(noteCount).toBe(4);
    });

    it('Deleting all notes at the same time', async () => {
      console.log('Testing deletion of all notes using shortcut...');
    
      // Set up dialog listener to accept confirmation automatically
      page.on('dialog', async dialog => {
        console.log('Dialog message:', dialog.message());
        await dialog.accept();
      });
    
      // Trigger the shortcut to delete all notes
      await page.keyboard.down('Control'); 
      await page.keyboard.down('Shift');   
      await page.keyboard.press('KeyD');  
      await page.keyboard.up('Shift');    
      await page.keyboard.up('Control');  
    });

    it('Checking for no notes existing now', async () => {
      console.log('Verifying the number of notes...');
  
      const noteCount = await page.evaluate(() => {
        return document.querySelectorAll('.note').length;
      });

      expect(noteCount).toBe(0);
    });

    it('Adding a note, editing it, and saving with Tab', async () => {
      console.log('Testing adding, editing, and saving a note...');
    
      // Add a new note
      await page.waitForSelector('.add-note', { visible: true });
      await page.click('.add-note');
    
      // Wait for the new note to appear and be ready for input
      await page.waitForSelector('.note', { visible: true });
      const noteSelector = '.note:last-child';  // Assume the new note is the last one
    
      // Focus the last added note which should be the new one
      await page.focus(noteSelector);
    
      // Type 'Mach 1' into the note
      await page.keyboard.type('Mach 1');
    
      // Press 'Tab' to trigger saving the note
      await page.keyboard.press('Tab');
    
      // Optionally verify the content of the note
      const noteContent = await page.$eval(noteSelector, el => el.value);
      console.log('Note content after editing and saving:', noteContent);
    
      // Assert that the note contains the correct content
      expect(noteContent).toBe('Mach 1');
    });
    
    it('Double click delete test', async () => {
      console.log('Testing deletion of the most recent note by double-clicking...');
    
      // Ensure that there is at least one note to interact with
      await page.waitForSelector('.note', { visible: true });
      const initialNoteCount = await page.evaluate(() => document.querySelectorAll('.note').length);
    
      if (initialNoteCount === 0) {
        throw new Error("No notes available to delete.");
      }
    
      // Focus and double-click the most recent note to trigger deletion
      const mostRecentNoteSelector = '.note:last-child';
      const note = await page.$(mostRecentNoteSelector);
      if (!note) {
        throw new Error("No recent note found to double-click and delete.");
      }
    
      const box = await note.boundingBox();
      if (!box) {
        throw new Error("Recent note is not visible or not found.");
      }
    
      // Double-click on the most recent note's position
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { clickCount: 2 });
    
      // Re-count the notes after the expected deletion
      const finalNoteCount = await page.evaluate(() => document.querySelectorAll('.note').length);
    
      console.log('Initial note count:', initialNoteCount);
      console.log('Final note count after deletion:', finalNoteCount);
    
      // Assert that the number of notes has decreased by exactly one
      expect(finalNoteCount).toBe(initialNoteCount - 1);
    });

    it('Adding a note, editing it, and saving by clicking outside', async () => {
      console.log('Testing adding, editing, and saving a note by clicking outside...');
    
      // Add a new note
      await page.waitForSelector('.add-note', { visible: true });
      await page.click('.add-note');
    
      // Wait for the new note to appear and be ready for input
      await page.waitForSelector('.note', { visible: true });
      const noteSelector = '.note:last-child';  // Assume the new note is the last one
    
      // Focus the last added note which should be the new one
      await page.focus(noteSelector);
    
      // Type 'Mach 1' into the note
      await page.keyboard.type('Mach 2');
    
      // Click outside the note to trigger saving the note
      // This assumes clicking at coordinates (0, 0) is outside any note element
      await page.mouse.click(0, 0);
    
      // Optionally verify the content of the note
      const noteContent = await page.$eval(noteSelector, el => el.value);
      console.log('Note content after editing and saving by clicking outside:', noteContent);
    
      // Assert that the note contains the correct content
      expect(noteContent).toBe('Mach 2');
    });
  
    it('Reload test', async () => {
      console.log('Testing local storge of note content across page reloads...');
    
      // Reload the page to simulate a fresh session
      await page.reload({ waitUntil: 'networkidle0' });
    
      // Wait for notes to be visible again after reload
      await page.waitForSelector('.note', { visible: true });
    
      // Fetch all notes and check if any contains 'Mach 3'
      const noteExists = await page.evaluate(() => {
        const notes = Array.from(document.querySelectorAll('.note'));
        return notes.some(note => note.value.includes('Mach 2'));
      });

      // Assert that the note with 'Mach 3' still exists after the reload
      expect(noteExists).toBe(true);
    });
    
    
  });
  
