const axios = require("axios");

module.exports = function(app){
  app.get('/', (req,res) => {
    return res.status(200).json({ status:"success", message:'Unofficial API for プロジェクトセカイカラフルステージfeat.初音ミク'})
  })

app.get('/music', (req,res)=>{
  const id = +req.query.id;
  const name = req.query.name;
  const musicAchv = require('./asset/musicAchievements.json');
  const musicList = require('./asset/musics.json');
  const musicDiff = require('./asset/musicDifficulties.json');

  if(id&&name){
   return res.status(404).json({status:'failed',message:'You cannot set both query'}); 
  }
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
      return res.status(200).json(json);
    }else{
      return res.status(404).json({ status:'failed',message:'this musicID does not exist'})
    }
  } else if(name){
    let misc = musicList.find(m => m.title === name);
    if(misc != undefined){
    let achv = musicAchv.filter(m => m.musicAchievementType == 'combo');
    let mdiff = musicDiff.filter(m => m.musicId == misc.id);
    mdiff.forEach((m)=>{
      let bnote = []
      achv.filter(a=> a.musicDifficultyType == m.musicDifficulty).forEach(ad =>{
        bnote.push(Math.ceil(m.noteCount*ad.musicAchievementTypeValue))})
        m.bonusNotesCount = bnote
      })
      return res.status(200).json({ status:'success', musicList:misc, musicDiff: mdiff});
    } else {
      return res.status(404).json({ status:'failed',message:'this music name does not exist'})
    }
  } else {
    return res.status(404).json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/resBox', (req,res)=>{
  const id = +req.query.id;
  const type = req.query.type;
  const resBox = require('./asset/resourceBoxes.json');

  if (id&&type) {
    let resource = resBox.filter(r=>r.resourceBoxPurpose == type).find(r=>r.id == id);
    if(resource != undefined){
    let json = { status:'success',resourceBox:resource }
    return res.status(200).json(json);
    }else{
     return res.status(404).json({ status:'failed',message:'this resourceBoxID does not exist'})
    }
  } else {
    return res.status(404).json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/material', (req,res)=>{
  const id = +req.query.id;
  const material = require('./asset/materials.json');
  const materEx = require('./asset/materialExchanges.json');
  
  if (id) {
    let mater = material.find(m => m.id == id);
    if(mater != undefined){
    mater.image = `https://github.com/Sekai-World/sekai-viewer/blob/main/src/assets/common/material/material${id}.png`
    let json = { status:'success',material:mater }
    return res.status(200).json(json);
    }else{
     return res.status(404).json({ status:'failed',message:'this materialID does not exist'})
    }
  } else {
    return res.status(404).json({ status:'failed',message:'you have to set query'})
  }
})

app.get('/chara', (req,res)=>{
  const id = +req.query.id;
  const charaPref = require('./asset/characterProfiles.json');
  const charaName = require('./asset/gameCharacters.json');
  const charaUnit = require('./asset/gameCharacterUnits');
  if(id && id > 0){
    let chara = charaPref.find(c => c.characterId === id);
    let charaN = charaName.find(c => c.id === id);
    let charaU = charaUnit.find(c => c.gameCharacterId === id);
    if(chara != undefined){
      let json = { status:'success', charaData:chara, charaName:charaN, charaUnit:charaU}
      return res.status(200).json(json)
    }else{
      let json = {status:'failed',message:'this characterID does not exist'}
      return res.status(404).json(json)
    }
  }
})

app.get('/card', (req,res)=>{
  const id = +req.query.id;
  const cardPref = require('./asset/cards.json');
  const storPref = require('./asset/cardEpisodes.json')
  const cardCos3 = require('./asset/cardCostume3ds.json');
  const skilPref = require('./asset/skills.json');
  if (id && id > 0) {
    let card = cardPref.find(c => c.id == id);
    if(card != undefined){
    card.episodes = storPref.filter(s => s.cardId == id);
    let costume = cardCos3.filter(c => c.cardId == id);
    let skill = skilPref.find(s => s.id == card.skillId); 
    card.costume = costume;
    card.skill = skill;
    let json = { status:'success',cardData:card }
    return res.status(200).json(json);
    }else{
     return res.status(404).json({ status:'failed',message:'this cardID does not exist'})
    }
  } else {
    return res.status(200).json({ status:'success',cardRarity:require('./asset/cardRarities.json'), cardSkillCosts: require('./asset/cardSkillCosts')})
  }
})

app.get('/episode', (req,res)=>{
  const id = req.query.id;
  if(id){
  const storPref = require('./asset/cardEpisodes.json');
  let epi = storPref.find(s => s.id == id);
  if(epi != undefined){
  const ASSETBUNDLE_NAME = epi.assetbundleName;
  const SCENARIO_ID = epi.scenarioId;
  axios.get(`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member/${ASSETBUNDLE_NAME}_rip/${SCENARIO_ID}.asset`)
    .then(data=> res.status(200).json({status:'success',episodeData:data.data}))
  }else{
    return res.status(404).json({status:'failed',message:'this episodeID does not exist'})
  }
  }else{
    return res.status(404).json({ status:'failed',message:'you have to set query'})
  }
})

}