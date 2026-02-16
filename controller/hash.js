const bcrypt=require("bcrypt");
async function doHashing(password){
  let hashPwd=await bcrypt.hash(password,10);

  console.log(hashPwd);
}

doHashing("NorTH@123");
doHashing("sOUth@123");