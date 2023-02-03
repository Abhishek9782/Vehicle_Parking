const router = require('express').Router()
const Parking = require('../models/login')
const Intime = require('../models/ventery')
const Reviews = require('../models/review');



/*-----FOR LOGIN cHECK SECURITY ---------*/

function logincheck(req, res, next) {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect('/login')
  }
};
/*-------FOR HOME LOGIN PAGE------*/
router.get('/login', (req, res) => {
  res.render('mainlogin.ejs')
});

/*-------FOR LOGIN PR REDIRECT AAFTER LOGOUT PAGE------*/
router.get('/login', (req, res) => {
  if(req.session.isAuth){
    res.redirect('/allentry')
  }else{
 
  res.render('mainlogin.ejs')
}
    
});

/*-------FOR LOGIN PAGE PR PASSWORD------*/
router.get('/data', async (req, res) => {
  const username = 'abhishek';
  const password = "123"
  const parkingRecord = new Parking({ username: username, password, password })
  await parkingRecord.save()
  console.log(parkingRecord)
});
/*-------FOR HOME PAGE------*/
router.get('/', (req, res) => {
  res.render('parkinghome.ejs')
});

router.post('/', async (req, res) => {
  const { username, password } = req.body
  const parkinglogin = await Parking.findOne({ username: username })

  if (parkinglogin !== null) {
    if (parkinglogin.password == password) {
      req.session.isAuth = true;
      res.render('parkinghome.ejs')
    } else {
      res.redirect('/login')
    }

  } else {
    res.redirect('/login')
  }
});
/*-------FOR ALL ENTERY PR VALUE SEND KRNE K LIYE------*/
router.get('/allentry', logincheck, async (req, res) => {
  const Intimere = await Intime.find({ status: 'IN' })
  const $_all_entery= (await Intime.find({status:'IN'}).count()).toString()

  console.log($_all_entery)
  res.render('allentery.ejs', { Intimere: Intimere,$_all_entery:$_all_entery })
});

router.get('/NewEntery', logincheck, async (req, res) => {
  await res.render('addentery.ejs')
});
/*-------FOR NEW ENTERY ------*/


router.post('/NewEntery', async (req, res) => {
  const { vtype, vin, price, vno } = req.body
  const status = 'In'
  const vout = '0'
  const total = '0'


  /*-------FOR DATE TIMING CODING BUT THIS NOT USE IN CODING------*/

  let a = new Date();
  let vinminutes = a.getHours();
  let vminutes = a.getMinutes()
  let fulltime = Math.round(Number(vinminutes) + Number(vminutes / 60))

  //..........For current date & time.........//

  let year = a.getFullYear()
  let Month = ("0" + (a.getMonth() + 1)).slice(-2);
  let date = ("0" + (a.getDate())).slice(-2)
  const fullyear = date + "-" + Month + "-" + year




  const intimeRecord = new Intime({ vtype: vtype, vin: vin, price: price, vno: vno, status: 'IN', vout: '0', total: '0', time: fullyear,})

  await intimeRecord.save()
 
 res.redirect('/allentry')


})


/*-------FOR IN WALE PAGE KO OUT KRNE WALE FORM PR SAVE VALUE KO SHOW KRWANE K LIYE------*/

router.get('/statusupdate/:id', async (req, res) => {
  const id = req.params.id
  const oldvalue = await Intime.findById(id)
  res.render('updateEntery.ejs', { oldvalue: oldvalue })
})
/*-------FOR OUT KRNE WALE PAGE SE OUT TIMING KI VALUE KO PAKDNE K LIYE------*/

router.post('/statusupdate/:id', logincheck, async (req, res) => {
  const id = req.params.id
  const { vout } = req.body
  const updatevalue = await Intime.findById(id)

  /*-------CONDITION FOR VIECHLE TYPE  PRICE  DEFINING K LIYE------*/
  let finalamount = null;

  if (updatevalue.vtype = 'Two Wheeler') {
    finalamount = (vout - updatevalue.vin) * updatevalue.price
  }

  else if (updatevalue.vtype == 'Three Wheeler') {
    finalamount = (vout - updatevalue.vin) * updatevalue.price

  }

  else if (updatevalue.vtype == 'Four Wheeler') {
    finalamount = (vout - updatevalue.vin) * updatevalue.price
  }
  else if (updatevalue.vtype == 'Others') {
    finalamount = (vout - updatevalue.vin) * updatevalue.price
  }
  const totalvalue = await Intime.findByIdAndUpdate(id, { vout: vout, total: finalamount, status: 'OUT' })
  totalvalue.save()

  res.redirect('/allentry')

})

/*-------FOR NEW PAGE THERE IS ALL OUT VIECHELES------*/
router.get('/alloutViechele', logincheck, async (req, res) => {
  const alloutdata = await Intime.find({ status: "OUT" })
  const $_all_out=  (await Intime.find({status:"OUT"}).count()).toString()
  res.render('AllOutV.ejs', { alloutdata: alloutdata,$_all_out:$_all_out})

})


/*-------FOR DELETE ANY DATA BUT THIS IS NOT USE IN THIS COADING------*/
router.get('/delete/:id', async (req, res) => {
  const id = req.params.id
  await Intime.findByIdAndDelete(id)
  res.redirect('/allentry')

})
/*-------FOR DELETE ANY DATA BUT THIS IS NOT USE IN THIS COADING------

<td>
<a href="/delete/<%= result.id%>"><button>delete</button></a>
</td>

---*/

//.....For Printing Req ......//
router.get('/print/:id', logincheck, async (req, res) => {
  const id = req.params.id
  const Printrecord = await Intime.findById(id)
  res.render('print.ejs', { Printrecord: Printrecord })
})

//.....For user  reviews ......//
router.get('/allreviews', async (req, res) => {
  const allReview = await Reviews.find()
  const countt=(await Reviews.find().count()).toString()
  console.log(countt)
  
  res.render('allReviews.ejs', { allReview: allReview,countt:countt})
})

router.post('/reviews', async (req, res) => {
  const { name, email, rev } = req.body
  const status = "Unread"
  const allReview = new Reviews({ name: name, email: email, rev: rev, status: status })
  await allReview.save()
  console.log(allReview)
  res.redirect('/')
});


router.get('/updatestatus/:id', async (req, res) => {
  const id = req.params.id
  const Updatestatus = await Reviews.findById(id)

  console.log(Updatestatus)

  let a = null
  if (Updatestatus.status == 'Unread') {
    a = 'Read'
  } else {
    a = 'Unread'
  }
  const newrev = await Reviews.findByIdAndUpdate(id, { status: a })
  res.redirect('/allreviews')
})











module.exports = router