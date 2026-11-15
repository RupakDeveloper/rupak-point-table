export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const key=process.env.GEMINI_API_KEY;
 if(!key)return res.status(503).json({error:'AI is not configured yet. Add GEMINI_API_KEY in Vercel Project Settings → Environment Variables.'});
 try{
  const {image,enhance=true,matchCount=6}=req.body||{};
  if(!image||typeof image!=='string'||!image.startsWith('data:image/'))return res.status(400).json({error:'A valid image is required.'});
  const match=image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if(!match)return res.status(400).json({error:'Unsupported image format.'});
  const prompt=`You are an expert Free Fire esports match-result vision parser. Carefully inspect this uploaded screenshot/photo. Extract EVERY visible team row, even if the image is compressed, mildly blurred, tilted, or has decorative graphics. Use visual context and table alignment, do not hallucinate unreadable digits. Identify team name, Booyah/win indicator if present, placement points (P.P), kill points (K.P) or kills as displayed, and total if visible. IMPORTANT: The website expects placementPoints and kills; if screenshot has P.P and K.P columns, map them directly. If only raw placement rank is visible and scoring rules are not provided, do not guess placement points; set placementPoints to 0 and put a note in uncertainFields. If the screenshot shows a P.P numeric column, use that value. If it shows K.P, use that value as kills/kill points. Return JSON only in this exact shape: {"teams":[{"name":"team name","booyah":0,"placementPoints":0,"kills":0,"confidence":0.0,"uncertainFields":[]}],"notes":"brief note"}. Preserve spelling, punctuation, spaces and numbers as accurately as possible. Do not include header labels as teams. Confidence is 0 to 1. For ambiguous values, choose your best visual reading but list the field in uncertainFields. Do not omit rows just because confidence is low. Match count selected by user: ${matchCount}. Image enhancement requested: ${enhance}.`;
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:match[1],data:match[2]}}]}],generationConfig:{temperature:0.1,responseMimeType:'application/json'}})});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error?.message||'Vision model request failed');
  const raw=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
  const parsed=JSON.parse(raw.replace(/```json|```/g,'').trim());
  if(!Array.isArray(parsed.teams))throw new Error('AI response did not contain a team list');
  return res.status(200).json(parsed);
 }catch(e){return res.status(500).json({error:e.message||'Unable to analyse this image'});}
}
