'use strict';
(() => {
  const photoSources = [
    {src:'assets/pack-everyday.jpg',alt:'Illustrative green backpack with leather straps among leaves',credit:'Unsplash · photo-1547949003-9792a18a2601'},
    {src:'assets/pack-studio.jpg',alt:'Illustrative dark backpack in a sunlit studio',credit:'Unsplash · photo-1553062407-98eeb64c6a62'},
    {src:'assets/pack-detail.jpg',alt:'Illustrative black backpack held by its handle',credit:'Unsplash · photo-1581605405669-fcdf81165afa'},
    {src:'assets/desk-essentials.jpg',alt:'Illustrative notebooks, a pen and coffee on a wooden desk',credit:'Unsplash · photo-1473181488821-2d23949a045a'}
  ];
  const categories = [['quality','Quality',4.8],['value','Value for money',4.5],['ease','Ease of use',4.6],['durability','Durability',4.7],['shipping','Shipping / packaging',4.4]];
  const firstNames = ['Alex','Jamie','Morgan','Sam','Taylor','Robin','Casey','Jordan','Charlie','Riley','Avery','Drew','Quinn','Parker','Skyler','Blair','Reese','Rowan','Finley','Cameron'];
  const contexts = ['the morning train','a walking commute','a library day','a short city break','an afternoon at a cafe','a desk-to-gym day','a weekend away','a trip to the market'];
  const positives = [
    ['A place for the little things','The front compartment keeps my keys separate from the rest of my things. I can reach what I need without emptying the whole bag.'],
    ['Settled into my routine','The layout makes sense after a few days. My notebook and everyday essentials have their own place, and the bag stays comfortable on the way home.'],
    ['Simple in the best way','There are enough useful pockets without making the inside feel complicated. I appreciate the clean shape and the way it stands up beside my desk.'],
    ['Easy to take along','The straps felt comfortable with my normal daily load. I would still check the sleeve dimensions before choosing a size for a larger device.'],
    ['A thoughtful daily companion','The fabric has a pleasantly understated finish. I like being able to move from work to errands without changing bags halfway through the day.'],
    ['Room where I need it','My lunch container and notebook fit without everything becoming a puzzle. The side pocket works for my smaller bottle, although a very wide one may be snug.']
  ];
  const mixed = [
    ['Good idea, not quite my fit','I liked the pocket layout, but the strap spacing did not feel quite right on my shoulders. Trying the fit with your usual load would be worthwhile.'],
    ['Useful, with a small compromise','The pack works for a light day, though I wanted a little more room for my bulky lunch container. The smaller size was not the best match for my routine.'],
    ['Nearly there for my commute','I can see the appeal of the simple shape. With my heavier load, I found myself adjusting the straps more often than I expected.']
  ];
  const negatives = [
    ['The zipper needed work','The front zipper caught on its fabric edge during my first week. I could work around it, but it made reaching small items less convenient than I hoped.'],
    ['Not the experience I expected','The main opening was awkward with my usual load and the zipper felt stiff. I would want to try a different design before choosing this one again.']
  ];
  const distribution = [[1,12],[2,20],[3,56],[4,312],[5,847]];
  const reviews = [];
  for (const [rating,count] of distribution) for (let n=0;n<count;n++) {
    const i = reviews.length;
    const [title,text] = (rating >= 4 ? positives : rating === 3 ? mixed : negatives)[i % (rating >= 4 ? positives.length : rating === 3 ? mixed.length : negatives.length)];
    const tags = [];
    if (rating >= 4) {
      const position = i-88;
      if (position*73%1159 < 152) tags.push('quality');
      if (position*137%1159 < 98) tags.push('shipping');
      if (position*251%1159 < 87) tags.push('value');
      if (position*491%1159 < 76) tags.push('ease');
    }
    const topicText = {quality:'The material quality was a pleasant surprise.',shipping:'My sample delivery arrived quickly and the packaging was tidy.',value:'For my routine, this felt like good value.',ease:'The everyday access was easy to use.'};
    const body = `${text} I chose it for ${contexts[i%contexts.length]} in the ${['20L','24L'][i%2]} size. ${tags.map((tag) => topicText[tag]).join(' ')}`.trim();
    const review = {
      id:`review-${String(i+1).padStart(4,'0')}`,rating,title,body,
      name:`${firstNames[i%firstNames.length]} ${String.fromCharCode(65+(i*7%26))}.`,
      date:new Date(Date.UTC(2026,10,1,9)-((i*53+743)%1247)*6*3600000).toISOString(),
      size:['20L','24L'][i%2],color:['Moss','Oat','Ink'][i%3],
      verified:i%5!==0,recommend:i>=75,tags,
      yes:i%41,no:i%5,vote:0,incentive:i%113===0?'gift':'none',media:[],
      categories:Object.fromEntries(categories.map(([key]) => [key,rating])),
      pros:rating>=4?'Thoughtful organization':'',cons:rating<=3?'Fit or zipper feel could improve':'',local:false
    };
    if (i%52===0) review.media.push({...photoSources[(i/52)%4],type:'image',illustrative:true});
    reviews.push(review);
  }
  for (const [key,,target] of categories) {
    let remaining = Math.round(target*reviews.length)-reviews.reduce((sum,r) => sum+r.categories[key],0);
    for (const review of reviews) {
      if (!remaining) break;
      if (remaining>0 && review.rating===4) { review.categories[key]++;remaining--; }
      else if (remaining<0 && review.rating===5) { review.categories[key]--;remaining++; }
    }
  }
  const leadIndexes = [400,401,402,388,403,70,20,5,404,405];
  leadIndexes.forEach((index,position) => { reviews[index].date = new Date(Date.UTC(2026,10,12-position,9)).toISOString(); });
  Object.assign(reviews[400],{name:'Maya L.',title:'One bag. An entire everyday.',body:'I wanted one pack that could make the journey from the train to the office and then a stop at the shops. The 24L has room for my notebook, lunch and a light layer without feeling oversized. The smaller front pocket is where my keys finally live. After a few weeks of carrying it, the best thing I can say is that I have stopped thinking about my bag — it just fits the routine.',yes:154,no:2,size:'24L',color:'Moss',verified:true,media:[{...photoSources[0],type:'image',illustrative:true}],pros:'Thoughtful pockets; comfortable everyday carry',cons:'A wide bottle is a snug fit',response:'Thanks for the thoughtful perspective, Maya. This fictional 24L concept is designed around everyday organization. Checking a bottle’s dimensions before choosing a pack is always a useful detail.',responseDate:'2026-11-12T15:00:00Z'});
  Object.assign(reviews[401],{name:'Daniel K.',title:'Less rummaging. More getting on with it.',body:'The uncomplicated layout is what won me over. There is a place for a notebook and the little things I used to lose at the bottom of my old bag. I chose 20L for a lighter daily load. It would not be my pick for carrying bulky clothes and a big lunch box together, but it works well for a straightforward commute.',yes:89,no:1,size:'20L',color:'Ink',verified:true,media:[{...photoSources[2],type:'image',illustrative:true}],pros:'Easy access and a simple interior',cons:'Choose a larger size for bulkier loads'});
  window.fieldworkDemo = {reviews,categories,photoSources};
})();
