const express = require('express');
const app = express();
const axios = require('axios');
function isAuthorized(req,res, next) {
  const auth = req.headers.authorization;
  if (process.env.PASS.includes === auth) {
    next();
  } else {
    res.status(401);
    res.send('Not permitted');
  }
}
const port = 3000

app.get('/', (req,res) => {
  res.json({ status:'failed', message:'You have to assign route'})
})

app.get('/music', (req,res)=>{
  const id = +req.query.id;
  const musicAchv = require('../asset/musicAchievements.json');
  const musicList = require('../asset/musics.json');
  const musicDiff = require('../asset/musicDifficulties.json');

  if (id) {
    let misc = musicList.find(m => m.id == id)
    let achv = musicAchv.filter(m => m.musicAchievementType == 'combo')
    let mdiff = musicDiff.filter(m => m.musicId == id);
    mdiff.forEach((m)=>{
      let bnote = []
      achv.filter(a=> a.musicDifficultyType == m.musicDifficulty).forEach(ad =>{
        bnote.push(Math.ceil(m.noteCount*ad.musicAchievementTypeValue))})
        m.bonusNotesCount = bnote
      })
    if(misc != undefined){
    let json = { status:'success',musicList:misc, musicDiff: mdiff}
    res.json(json);
    }else{
      res.json({ status:'failed',message:'this musicID does not exist'})
    }
  } else {
    res.json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/resBox', (req,res)=>{
  const id = +req.query.id;
  const type = req.query.type;
  const resBox = require('../asset/resourceBoxes.json');

  if (id&&type) {
    let resource = resBox.filter(r=>r.resourceBoxPurpose == type).find(r=>r.id == id);
    if(resource != undefined){
    let json = { status:'success',resourceBox:resource }
    res.json(json);
    }else{
      res.json({ status:'failed',message:'this resourceBoxID does not exist'})
    }
  } else {
    res.json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/material', (req,res)=>{
  const id = +req.query.id;
  const material = require('../asset/materials.json');
  const materEx = require('../asset/materialExchanges.json');
  
  if (id) {
    let mater = material.find(m => m.id == id);
    mater.image = `https://github.com/Sekai-World/sekai-viewer/blob/main/src/assets/common/material/material${id}.png`
    if(mater != undefined){
    let json = { status:'success',material:mater }
    res.json(json);
    }else{
      res.json({ status:'failed',message:'this materialID does not exist'})
    }
  } else {
    res.json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/chara', (req,res)=>{
  const id = +req.query.id;
  const charaPref = require('../asset/characterProfiles.json');
  const charaName = require('../asset/gameCharacters.json');
  const charaUnit = require('../asset/gameCharacterUnits');
  if(id && id > 0){
    let chara = charaPref.find(c => c.characterId === id);
    let charaN = charaName.find(c => c.id === id);
    let charaU = charaUnit.find(c => c.gameCharacterId === id);
    if(chara != undefined){
      let json = { status:'success', charaData:chara, charaName:charaN, charaUnit:charaU}
      res.json(json)
    }else{
      let json = {status:'failed',message:'this characterID does not exist'}
      res.json(json)
    }
  }
})

app.get('/card', (req,res)=>{
  const id = +req.query.id;
  const cardPref = require('../asset/cards.json');
  const storPref = require('../asset/cardEpisodes.json')
  const cardCos3 = require('../asset/cardCostume3ds.json');
  const skilPref = require('../asset/skills.json');
  if (id && id > 0) {
    let card = cardPref.find(c => c.id == id);
    card.episodes = storPref.filter(s => s.cardId == id);
    let costume = cardCos3.filter(c => c.cardId == id);
    let skill = skilPref.find(s => s.id == card.skillId);
    if(card != undefined){
    card.costume = costume;
    card.skill = skill;
    let json = { status:'success',cardData:card }
    res.json(json);
    }else{
      res.json({ status:'failed',message:'this cardID does not exist'})
    }
  } else {
    res.json({ status:'success',cardRarity:require('../asset/cardRarities.json'), cardSkillCosts: require('../asset/cardSkillCosts')})
  }
})

app.get('/episode', (req,res)=>{
  const id = req.query.id;
  if(id){
  const storPref = require('../asset/cardEpisodes.json');
  let epi = storPref.find(s => s.id == id);
  if(epi != undefined){
  const ASSETBUNDLE_NAME = epi.assetbundleName;
  const SCENARIO_ID = epi.scenarioId;
  axios.get(`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member/${ASSETBUNDLE_NAME}_rip/${SCENARIO_ID}.asset`)
    .then(data=> res.json({status:'success',episodeData:data.data}))
  }else{
    res.json({status:'failed',message:'this episodeID does not exist'})
  }
  }else{
    res.json({ status:'failed',message:'you have to set query'})
  }
})

app.listen(port, () => console.log(`listening on port ${port}!`))