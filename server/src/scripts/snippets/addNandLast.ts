const doIt = async () => {

  const one: any = await Lctns.findOne({ n: 0 }).lean();

  if (!one) return one;

  let allOfGuid: any = await Lctns.find({ guid: one.guid }).sort({createdAt: 1}).lean();

  for (const [i, l] of allOfGuid.entries()) {
    await Lctns.updateOne({ _id: l._id }, {
      n: i + 1,
      last: allOfGuid.length === i + 1
    })    
  }


  return one;

}

const run = async () => {

//  await Lctns.updateMany({}, {
//    n: 0,
//  })   
//  console.log('done')

  let one = true;
  let count = 1;

  while (one) {
    console.log(count);
    one = await doIt();
    count++;
  }
  console.log('done')  
}

run()