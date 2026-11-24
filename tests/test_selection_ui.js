// Behavioural smoke test of the production homepage JS with a small in-memory IPO dataset.
// No browser dependencies: the HTML's real script executes against DOM/fetch doubles.
"use strict";
const fs=require("fs"),vm=require("vm"),assert=require("assert");
const html=fs.readFileSync(require("path").join(__dirname,"../docs/index.html"),"utf8");
const found=html.match(/<script>([\s\S]*?)<\/script>/);
assert(found,"Homepage script missing");
const fixtures=[
 {company_name:"HD현대에너지솔루션",listing_date:"2020-01-02",market:"코스피",listing_track:"일반",industry:"에너지",lead_underwriter_1:"한국투자증권",lead_underwriter_2:"",offering_amount_100m:"1000",base_fee_pct:"3",performance_fee_cap_pct:"1",stock_code:"101010",verification_status:"verified",source_url:"https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20200102000001"},
 {company_name:"HD현대신사업",listing_date:"2022-01-03",market:"코스피",listing_track:"일반",industry:"제조",lead_underwriter_1:"한국투자증권",lead_underwriter_2:"",offering_amount_100m:"2000",base_fee_pct:"5",performance_fee_cap_pct:"",stock_code:"202020",verification_status:"manual_verified",source_url:"https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20220103000001"},
 {company_name:"기타상장사",listing_date:"2023-01-04",market:"코스닥",listing_track:"기술특례",industry:"제약",lead_underwriter_1:"NH투자증권",lead_underwriter_2:"",offering_amount_100m:"300",base_fee_pct:"4",performance_fee_cap_pct:"2",stock_code:"303030",verification_status:"verified",source_url:"https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20230104000001"},
 {company_name:"미검증 IPO",listing_date:"2021-03-04",market:"코스피",listing_track:"일반",industry:"기타",lead_underwriter_1:"",lead_underwriter_2:"",offering_amount_100m:"",base_fee_pct:"8",performance_fee_cap_pct:"8",stock_code:"404040",verification_status:"needs_review",source_url:""}
];
const elements={};
function element(id) {
 if(!elements[id]) elements[id]={
  id,value:"",textContent:"",innerHTML:"",disabled:false,handlers:{},
  classList:{toggle(){}},addEventListener(event,handler){this.handlers[event]=handler}
 };
 return elements[id];
}
let blob,filename;
const document={
 getElementById:element,querySelectorAll(){return []},
 createElement(){return {href:"",download:"",click(){filename=this.download},remove(){}}},
 body:{appendChild(){}}
};
const sandbox={
 document,console,Blob,URL:{createObjectURL(b){blob=b;return "blob:test"},revokeObjectURL(){}},
 setTimeout(fn){fn()},
 fetch:async()=>({ok:true,json:async()=>({updated_at:"test",records:fixtures})})
};
vm.runInNewContext(found[1],sandbox);
function fire(id,type){assert(element(id).handlers[type],id+" missing "+type+" event");element(id).handlers[type]()}
function clickAttribute(id,attr,value,type){
 const button={disabled:false,getAttribute(name){return name===attr?value:null}};
 const target={closest(){return button}};
 assert(element(id).handlers.click,id+" missing click event");
 element(id).handlers.click({target});
}
function check(condition,message){assert(condition,message)}
function key(f){return f.stock_code+"|"+f.listing_date}
(async()=>{
 await new Promise(resolve=>setImmediate(resolve));
 await new Promise(resolve=>setImmediate(resolve));
 check(element("baseMean").textContent==="4.00%","initial mean of 3 verified companies");
 check(element("perfMean").textContent==="1.50%","missing performance rate not treated as zero");
 check(element("numRecords").textContent==="3건","review candidates excluded");
 element("search").value="HD현대";fire("search","input");
 check(element("numRecords").textContent==="2건","filter by HD Hyundai company keyword");
 check(element("baseMean").textContent==="4.00%","mean for Hyundai filtered candidates");
 clickAttribute("tbody","data-exclude",key(fixtures[1]));
 check(element("numRecords").textContent==="1건","remove one candidate");
 check(element("baseMean").textContent==="3.00%","remove affects mean");
 element("companyPicker").value="기타";fire("companyPicker","input");
 check(element("companySearchResults").innerHTML.includes("기타상장사"),"search beyond filters");
 clickAttribute("companySearchResults","data-add",key(fixtures[2]));
 check(element("numRecords").textContent==="2건","manually add outside search and KOSPI filter");
 check(element("baseMean").textContent==="3.50%","manual add affects mean");
 check(element("perfMean").textContent==="1.50%","manual add affects performance cap mean");
 fire("download","click");
 check(filename==="IPO_평균수수료_산출대상_목록.csv","CSV filename");
 const csv=await blob.text();
 check(csv.includes("HD현대에너지솔루션")&&csv.includes("기타상장사"),"CSV exports selected IPOs");
 check(!csv.includes("HD현대신사업")&&!csv.includes("미검증 IPO"),"CSV excludes removed and unverified IPOs");
 fire("clearOverrides","click");
 check(element("numRecords").textContent==="2건","clear selection overrides retains filters");
 check(element("baseMean").textContent==="4.00%","clear overrides restores original candidates");
 fire("excludeCandidates","click");
 check(element("numRecords").textContent==="0건","bulk exclude candidates");
 element("companyPicker").value="HD현대";fire("companyPicker","input");
 clickAttribute("companySearchResults","data-add",key(fixtures[1]));
 check(element("numRecords").textContent==="1건","re-add excluded candidate from search");
 check(element("baseMean").textContent==="5.00%","restored candidate changes mean");
 fire("reset","click");
 check(element("numRecords").textContent==="3건","global reset clears filters and manual changes");
 console.log("PASS: search by group keyword, add/exclude, average numerator, per-rate denominator, CSV, bulk exclusion and reset");
})().catch(error=>{console.error(error);process.exitCode=1});
