export async function verify(page,assert){
 await page.getByRole('button',{name:'Field Notes journal'}).click();assert.equal(await page.locator('#case-title').textContent(),'Field Notes journal');
 assert.match(await page.locator('#approach').textContent(),/editorial grid/);
 assert.equal(await page.getByRole('button',{name:'Field Notes journal'}).getAttribute('aria-expanded'),'true');
 await page.locator('#book').click();assert(await page.locator('#booking').isVisible());
 await page.locator('input[name=email]').fill('reader@example.com');await page.locator('select').selectOption({index:1});await page.getByRole('button',{name:'Preview request'}).click();
 assert.match(await page.locator('#booking-status').textContent(),/Thursday.*Nothing has been sent/);
 await page.getByRole('button',{name:'Close booking'}).click();assert(!await page.locator('#booking').isVisible());
 await page.getByRole('button',{name:'GitHub demo profile'}).click();assert.match(await page.locator('#profile-status').textContent(),/not connected/);
 const response=await page.request.get(new URL('resume.pdf',page.url()).href);assert.equal(response.status(),200);assert((await response.body()).subarray(0,5).toString()==='%PDF-');
 return 9;
}
