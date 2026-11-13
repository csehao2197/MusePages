import {test} from "node:test";
import assert from "node:assert/strict";
import {products,emptyCart,restoreCart,setQuantity,totals,browse,checkoutDraft,assistantReply,cartFingerprint} from "./assets/engine.js";
test("cart restores only supported unique, available, bounded sample items",() => {
  assert.deepEqual(restoreCart(null),emptyCart());
  for(const raw of ["bad",JSON.stringify({schema:2,items:[]}),JSON.stringify({schema:1,revision:0,items:[{id:"after-dark-leek",quantity:1}]}),JSON.stringify({schema:1,revision:0,items:[{id:"little-leek",quantity:1},{id:"little-leek",quantity:1}]})]) assert.throws(()=>restoreCart(raw));
});
test("quantity changes are immutable, revisioned and respect stock and exact removal",() => {
  const original=emptyCart(),added=setQuantity(original,"little-leek",1);
  assert.equal(original.items.length,0); assert.equal(added.revision,1);
  const multiple=setQuantity(added,"daily-greens-mug",1);
  assert.deepEqual(setQuantity(multiple,"little-leek",2).items.map((item)=>item.id),["little-leek","daily-greens-mug"]);
  assert.equal(setQuantity(added,"little-leek",0).items.length,0);
  for(const q of [-1,.5,9,1]) assert.throws(()=>setQuantity(added,"little-leek",q));
  assert.throws(()=>setQuantity(original,"missing",1));
});
test("integer totals apply shipping once and the free threshold at exactly sixty dollars",() => {
  const small=setQuantity(emptyCart(),"daily-greens-mug",1);
  assert.deepEqual(totals(small),{subtotal:1800,count:1,shipping:500,total:2300});
  const threshold=setQuantity(setQuantity(emptyCart(),"daily-greens-mug",2),"little-leek",1);
  assert.equal(totals(threshold).subtotal,6000); assert.equal(totals(threshold).shipping,0);
  assert.equal(totals(threshold,{zone:"farther",speed:"standard"}).total,7200);
  assert.equal(totals(threshold,{zone:"farther",speed:"express"}).total,7900);
  assert.equal(totals(emptyCart()).shipping,0);
  assert.throws(()=>totals(threshold,{zone:"anywhere"}));
});
test("browse intersects category and literal search and sorts numeric prices",() => {
  assert.equal(browse().length,12);
  assert.equal(browse({query:"ceramic",category:"Home"})[0].id,"daily-greens-mug");
  assert.equal(browse({query:"ceramic",category:"Wearables"}).length,0);
  assert.equal(browse({query:"["}).length,0);
  const low=browse({sort:"low"}); assert.ok(low.every((item,i)=>i===0||low[i-1].price<=item.price));
});
test("checkout validates fictional inputs, currency conservation and unsent receipt status",() => {
  const cart=setQuantity(emptyCart(),"little-leek",2),copy=cartFingerprint(cart);
  const receipt=checkoutDraft(cart,{nickname:"Demo Friend",zone:"local",speed:"standard",confirmed:true});
  assert.equal(receipt.total,5300); assert.equal(receipt.items[0].lineTotal,4800); assert.equal(receipt.kind,"UNSENT DEMO RECEIPT");
  assert.equal(cartFingerprint(cart),copy);
  for(const nickname of ["","x","a".repeat(41),"a\nb"]) assert.throws(()=>checkoutDraft(cart,{nickname,zone:"local",speed:"standard",confirmed:true}));
  assert.throws(()=>checkoutDraft(cart,{nickname:"Demo",zone:"local",speed:"standard",confirmed:false}));
});
test("assistant exposes deterministic rules, excludes unavailable products and never edits cart",() => {
  const cart=setQuantity(emptyCart(),"tiny-leek-pin",1),copy=cartFingerprint(cart);
  const gifts=assistantReply("gifts under $25",cart);
  assert.ok(gifts.ids.length>0&&gifts.ids.every((id)=>products.find((item)=>item.id===id).price<2500));
  assert.equal(assistantReply("under $7",cart).ids.length,0);
  assert.equal(assistantReply("light",cart).ids.length,0);
  assert.ok(assistantReply("my cart",cart).message.includes("1 item"));
  assert.equal(assistantReply("shipping",cart).rule,"sample shipping policy");
  assert.equal(assistantReply("unknown words",cart).rule,"help");
  assert.equal(cartFingerprint(cart),copy);
});
