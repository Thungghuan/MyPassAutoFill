'use strict';
window.onload = function() {
	//测试数据
	Global_VAR.sTest = SysUtils.getUrlParams("sTest");
	if(Global_VAR.sTest != undefined) {
		Global_VAR.initData = "http://192.168.1.25/door/health/h5/get"; // 初始化数据
		Global_VAR.add = "http://192.168.1.25/door/health/h5/add"; // 重新上报
		Global_VAR.oneKeyAdd = "http://192.25.1.221/door/health/h5/oneKeyAdd"; // 一键上报
		Global_VAR.getAreaTree = "http://192.168.1.25/door/base/public/web/getAreaTree"; // 获取省市区

	}
	Global_FN.render();
}
//全局变量
var Global_VAR = {
	initData: SysUtils.getHttpRoot() + "/health/h5/get", // 初始化数据
	add: SysUtils.getHttpRoot() + "/health/h5/add", // 重新上报
	oneKeyAdd: SysUtils.getHttpRoot() + "/health/h5/oneKeyAdd", // 一键上报
	getAreaTree: SysUtils.getHttpRoot() + "/base/public/web/getAreaTree", // 获取省市区
	nowYMD: SysUtils.getNowYMD(), // 当前年月日
	formName: "filter_form",
	provinceData: [],      // 地区数据
	campusData: [],        // 校区数据
	classData: [],         // 班级数据
	collegeData: [],       // 学院数据
	majorData: [],       // 专业数据
	iRctOutData: [],       // 海外数据
	isChechPass: false,  // 是否验证通过
	nowYearAndMoreList: [],  // 今年以及7年前
	beforeTimeText: "暂无",      // 上一次填报时间说明
	uploadBtnClick: true, //  一键填报 按钮是否可点击
	changeBtnClick: true, //  重新填报 按钮是否可点击
	classPicker: null,
	healthRptPerson: { // 基础信息
		sHomeProvName: "",   // 家庭所属省份名称
		sHomeProvCode: "",   // 家庭所属省份编码
		sHomeCityName: "",   // 家庭所属地市名称
		sHomeCityCode: "",   // 家庭所属地市编码
		sHomeCountyName: "", // 家庭所属区县名称
		sHomeCountyCode: "", // 家庭所属区县编码
		// sHomeAddr: ""        // 家庭详细住址
	},
	healthRptInfor: { // 人员情况
		id: "",
		dRptDate: null,        // 填报日期
		sSelfProvName: "",   // 本人隔离省份名称
		sSelfProvCode: "",   // 本人隔离省份编码
		sSelfCityName: "",   // 本人隔离地市名称
		sSelfCityCode: "",   // 本人隔离地市编码
		sSelfCountyName: "", // 本人隔离区县名称
		sSelfCountyCode: "", // 本人隔离区县编码
		sFamilyProvName: "", // 家人隔离省份名称
		sFamilyProvCode: "", // 家人隔离省份编码
		sFamilyCityName: "", // 家人隔离地市名称
		sFamilyCityCode: "", // 家人隔离地市编码
		sFamilyCountyName: "", // 家人隔离区县名称
		sFamilyCountyCode: "", // 家人隔离区县编码
		sNowProvName: "",    // 当前居留省份名称
		sNowProvCode: "",    // 当前居留省份编码
		sNowCityName: "",    // 当前居留地市名称
		sNowCityCode: "",    // 当前居留地市编码
		sNowCountyName: "",  // 当前居留区县名称
		sNowCountyCode: "",  // 当前居留区县编码
		sRctKeyProvName: "", // 离开疫情防控重点区域（中、高风险地区）的省份名称
		sRctKeyProvCode: "", // 离开疫情防控重点区域（中、高风险地区）的省份编码
		sRctKeyCityName: "", // 离开疫情防控重点区域（中、高风险地区）的地市名称
		sRctKeyCityCode: "", // 离开疫情防控重点区域（中、高风险地区）的地市编码
	},
}
var Global_FN = {
	render () {
		layui.use(['form'], function() {
			let form = layui.form;
			let $ = layui.jquery;

			Global_FN.getProvinceData();

			$(".nowYMD").text(Global_VAR.nowYMD); // 页面时间
			// Global_VAR.provinceData = provinceData.data;  // 赋值 区域数据
			// Global_FN.campusExchange(campusData.data);    // 赋值 校区数据
			// Global_FN.classExchange(classData.data);      // 赋值 班级数据
			// Global_FN.collegeExchange(collegeData.data);  // 赋值 学院数据
			// Global_FN.majorExchange(majorData.data);      // 赋值 专业数据
			// Global_FN.iRctOutExchange(provinceData.data); // 赋值 海外数据

			// Global_FN.getNowYearAndMore(); // 获取 今年以及前7年 数据

			// Global_FN.initProvincePicker(); // 初始化 区域 组件
			// Global_FN.initDatePicker(); // 初始化 日期 组件
			// Global_FN.initRadioChange(); // 初始化 单选 组件
			// Global_FN.isShowLoading(false);

			$.ajax({
				url: Global_VAR.initData,
				type: "get",
				data: "",
				error: function(data) {
					// console.log("请求失败");
					$("#weuiDialog").show();
				},
				success: function(res) {
					if(res.code == 1) { // 列表赋值

						// form.val(Global_VAR.formName, {
						// 	"sPersonName": res.data.sPersonName,
						// 	"sPersonCode": res.data.sPersonCode
						// })
						if (res.data.basePersonAttr) { // 人员基本信息
							let basePersonAttr = res.data.basePersonAttr;
							$(".iInSchool").text(basePersonAttr.iInSchool || "");

							if (basePersonAttr.sDegreeCode == "1") {
								basePersonAttr.sDegreeCode = "本科生";
							} else if (basePersonAttr.sDegreeCode == "2") {
								basePersonAttr.sDegreeCode = "研究生";
							} else if (basePersonAttr.sDegreeCode == "3") {
								basePersonAttr.sDegreeCode = "留学生";
							} else if (basePersonAttr.sDegreeCode == "4") {
								basePersonAttr.sDegreeCode = "交换生";
							} else if (basePersonAttr.sDegreeCode == "5") {
								basePersonAttr.sDegreeCode = "预科生";
							}

							if (basePersonAttr.iSex == "1") {
								basePersonAttr.iSex = "男";
							} else if (basePersonAttr.iSex == "2") {
								basePersonAttr.iSex = "女";
							}

							form.val(Global_VAR.formName, {
								"sPersonName": basePersonAttr.sPersonName || "-",
								"sPersonCode": basePersonAttr.sPersonCode || "-",
								"sDegreeCode": basePersonAttr.sDegreeCode || "-",
								"iSex": basePersonAttr.iSex || "-",
								"sDormBuild": basePersonAttr.sDormBuild || "-",
								"sDormRoom": basePersonAttr.sDormRoom || "-",
							}),

							$(".sCampusName").text(basePersonAttr.sCampusName || "-");
							$(".sClassName").text(basePersonAttr.sClassName || "-");
							$(".sMajorName").text(basePersonAttr.sMajorName || "-");
							$(".sCollegeName").text(basePersonAttr.sCollegeName || "-");
						}
						if (res.data.healthRptPerson) { // 人员信息 赋值
							let healthRptPerson = res.data.healthRptPerson;

							form.val(Global_VAR.formName, {
								"sPhone": healthRptPerson.sPhone || "",
								"sParentPhone": healthRptPerson.sParentPhone || "",
								"iIsGangAoTai": healthRptPerson.iIsGangAoTai || "",
								"iIsOversea": healthRptPerson.iIsOversea || "",
								"sHomeAddr": healthRptPerson.sHomeAddr || ""
							});

							Global_VAR.healthRptPerson.sHomeProvName =  healthRptPerson.sHomeProvName || "";
							Global_VAR.healthRptPerson.sHomeProvCode =  healthRptPerson.sHomeProvCode || "";
							Global_VAR.healthRptPerson.sHomeCityName =  healthRptPerson.sHomeCityName || "";
							Global_VAR.healthRptPerson.sHomeCityCode =  healthRptPerson.sHomeCityCode || "";
							Global_VAR.healthRptPerson.sHomeCountyName = healthRptPerson.sHomeCountyName || "";
							Global_VAR.healthRptPerson.sHomeCountyCode =  healthRptPerson.sHomeCountyCode || "";
							if (healthRptPerson.sHomeProvName && healthRptPerson.sHomeCityName && healthRptPerson.sHomeCountyName && healthRptPerson.sHomeCountyName != "*") {
								$(".sHomeProvName").text(healthRptPerson.sHomeProvName + "/" + healthRptPerson.sHomeCityName + "/" + healthRptPerson.sHomeCountyName);
							} else if (healthRptPerson.sHomeProvName && healthRptPerson.sHomeCityName && healthRptPerson.sHomeCountyName && healthRptPerson.sHomeCountyName == "*") {
								$(".sHomeProvName").text(healthRptPerson.sHomeProvName + "/" + healthRptPerson.sHomeCityName);
							}
						}
						if (res.data.healthRptInfor) { // 基础信息
							let healthRptInfor = res.data.healthRptInfor;

							form.val(Global_VAR.formName, {
								"iSelfState": healthRptInfor.iSelfState,
								"sSelfAddr": healthRptInfor.sSelfAddr || "",
								"sSelfRemark": healthRptInfor.sSelfRemark || "",
								"iFamilyState": healthRptInfor.iFamilyState,
								"sFamilyAddr": healthRptInfor.sFamilyAddr || "",
								"sFamilyRemark": healthRptInfor.sFamilyRemark || "",
								"sNowAddr": healthRptInfor.sNowAddr || "",
								"iNowGoRisks": healthRptInfor.iNowGoRisks || "",
								"sNowGoRisksTool": healthRptInfor.sNowGoRisksTool || "",
								"iRctRisks": healthRptInfor.iRctRisks || "",
								"sRctRisksNum": healthRptInfor.sRctRisksNum || "",
								"iRctKey": healthRptInfor.iRctKey || "",
								"iRctKeyLeave": healthRptInfor.iRctKeyLeave || "",
								"iRctOut": healthRptInfor.iRctOut || "",
								"iRctOutLeave": healthRptInfor.iRctOutLeave || "",
								"iRctTouchKeyMan": healthRptInfor.iRctTouchKeyMan || "",
								"iRctTouchBackMan": healthRptInfor.iRctTouchBackMan || "",
								"iRctTouchDoubtMan": healthRptInfor.iRctTouchDoubtMan || "",
							});

							Global_VAR.healthRptInfor.sSelfProvName = healthRptInfor.sSelfProvName || "";
							Global_VAR.healthRptInfor.sSelfProvCode = healthRptInfor.sSelfProvCode || "";
							Global_VAR.healthRptInfor.sSelfCityName = healthRptInfor.sSelfCityName || "";
							Global_VAR.healthRptInfor.sSelfCityCode = healthRptInfor.sSelfCityCode || "";
							Global_VAR.healthRptInfor.sSelfCountyName = healthRptInfor.sSelfCountyName || "";
							Global_VAR.healthRptInfor.sSelfCountyCode = healthRptInfor.sSelfCountyCode || "";
							if (healthRptInfor.sSelfProvName && healthRptInfor.sSelfCityName && healthRptInfor.sSelfCountyName && healthRptInfor.sSelfCountyName != "*" ) {
								$(".sSelfProvName").text(healthRptInfor.sSelfProvName + "/" + healthRptInfor.sSelfCityName + "/" + healthRptInfor.sSelfCountyName);
							} else if (healthRptInfor.sSelfProvName && healthRptInfor.sSelfCityName && healthRptInfor.sSelfCountyName && healthRptInfor.sSelfCountyName == "*") {
								$(".sSelfProvName").text(healthRptInfor.sSelfProvName + "/" + healthRptInfor.sSelfCityName);
							}

							Global_VAR.healthRptInfor.sFamilyProvName = healthRptInfor.sFamilyProvName || "";
							Global_VAR.healthRptInfor.sFamilyProvCode = healthRptInfor.sFamilyProvCode || "";
							Global_VAR.healthRptInfor.sFamilyCityName = healthRptInfor.sFamilyCityName || "";
							Global_VAR.healthRptInfor.sFamilyCityCode = healthRptInfor.sFamilyCityCode || "";
							Global_VAR.healthRptInfor.sFamilyCountyName = healthRptInfor.sFamilyCountyName || "";
							Global_VAR.healthRptInfor.sFamilyCountyCode = healthRptInfor.sFamilyCountyCode || "";
							if (healthRptInfor.sFamilyProvName && healthRptInfor.sFamilyCityName && healthRptInfor.sFamilyCountyName && healthRptInfor.sFamilyCountyName != "*" ) {
								$(".sFamilyProvName").text(healthRptInfor.sFamilyProvName + "/" + healthRptInfor.sFamilyCityName + "/" + healthRptInfor.sFamilyCountyName);
							} else if (healthRptInfor.sFamilyProvName && healthRptInfor.sFamilyCityName && healthRptInfor.sFamilyCountyName && healthRptInfor.sFamilyCountyName == "*" ) {
								$(".sFamilyProvName").text(healthRptInfor.sFamilyProvName + "/" + healthRptInfor.sFamilyCityName);
							}

							Global_VAR.healthRptInfor.sNowProvName = healthRptInfor.sNowProvName || "";
							Global_VAR.healthRptInfor.sNowProvCode = healthRptInfor.sNowProvCode || "";
							Global_VAR.healthRptInfor.sNowCityName = healthRptInfor.sNowCityName || "";
							Global_VAR.healthRptInfor.sNowCityCode = healthRptInfor.sNowCityCode || "";
							Global_VAR.healthRptInfor.sNowCountyName = healthRptInfor.sNowCountyName || "";
							Global_VAR.healthRptInfor.sNowCountyCode = healthRptInfor.sNowCountyCode || "";
							if (healthRptInfor.sNowProvName && healthRptInfor.sNowCityName && healthRptInfor.sNowCountyName && healthRptInfor.sNowCountyName != "*" ) {
								$(".sNowProvName").text(healthRptInfor.sNowProvName + "/" + healthRptInfor.sNowCityName + "/" + healthRptInfor.sNowCountyName);
							} else if (healthRptInfor.sNowProvName && healthRptInfor.sNowCityName && healthRptInfor.sNowCountyName && healthRptInfor.sNowCountyName == "*" ) {
								$(".sNowProvName").text(healthRptInfor.sNowProvName + "/" + healthRptInfor.sNowCityName);
							}

							Global_VAR.healthRptInfor.sRctKeyProvName = healthRptInfor.sRctKeyProvName || "";
							Global_VAR.healthRptInfor.sRctKeyProvCode = healthRptInfor.sRctKeyProvCode || "";
							Global_VAR.healthRptInfor.sRctKeyCityName = healthRptInfor.sRctKeyCityName || "";
							Global_VAR.healthRptInfor.sRctKeyCityCode = healthRptInfor.sRctKeyCityCode || "";
							if (healthRptInfor.sRctKeyProvName && healthRptInfor.sRctKeyCityName) {
								$(".sRctKeyProvName").text(healthRptInfor.sRctKeyProvName + "/" + healthRptInfor.sRctKeyCityName);
							}

							Global_VAR.healthRptInfor.sRctOutCityName = healthRptInfor.sRctOutCityName || "";
							Global_VAR.healthRptInfor.sRctOutCityCode = healthRptInfor.sRctOutCityCode || "";
							if (healthRptInfor.sRctOutCityName) {
								$(".sRctOutCityName").text(healthRptInfor.sRctOutCityName);
							}

							$(".dSelfDate").text(healthRptInfor.dSelfDate);
							$(".dFamilyDate").text(healthRptInfor.dFamilyDate);
							$(".dNowGoRisksDate").text(healthRptInfor.dNowGoRisksDate);
							$(".dRctRisksDate").text(healthRptInfor.dRctRisksDate);
							$(".dRctKeyDate").text(healthRptInfor.dRctKeyDate);
							$(".dRctOutDate").text(healthRptInfor.dRctOutDate);

							Global_VAR.beforeTimeText = healthRptInfor.dRptDate;

							if (healthRptInfor.iSelfState == "2" || healthRptInfor.iSelfState == "3" || healthRptInfor.iSelfState == "4" || healthRptInfor.iSelfState == "5" || healthRptInfor.iSelfState == "6" || healthRptInfor.iSelfState == "7") {
								$(".self_isolation").show();
								$(".dSelfDateLabel").text("隔离日期");
								$(".sSelfProvNameLabel").text("隔离地所属区域");
								$(".sSelfAddrLabel").text("隔离地详细地址");
							} else if ( healthRptInfor.iSelfState == "9") {
								$(".self_isolation").show();
								$(".dSelfDateLabel").text("治愈日期");
								$(".sSelfProvNameLabel").text("治愈地所属区域");
								$(".sSelfAddrlLabel").text("治愈地详细地址");
							} else if ( healthRptInfor.iSelfState == "10") {
								$("#sSelfRemarkBox").show();
							} else {
								$("#sSelfRemarkBox").hide();
								$(".self_isolation").hide();
							}

							if (healthRptInfor.iFamilyState == "2" || healthRptInfor.iFamilyState == "3" || healthRptInfor.iFamilyState == "4" || healthRptInfor.iFamilyState == "5" || healthRptInfor.iFamilyState == "6" || healthRptInfor.iFamilyState == "7") {
								$(".family_isolation").show();
								$(".dFamilyDateLabel").text("隔离日期");
								$(".sFamilyProvNameLabel").text("隔离地所属区域");
								$(".sFamilyAddrLabel").text("隔离地详细地址");
							} else if ( healthRptInfor.iFamilyState == "9") {
								$(".family_isolation").show();
								$(".dFamilyDateLabel").text("治愈日期");
								$(".sFamilyProvNameLabel").text("治愈地所属区域");
								$(".sFamilyAddrLabel").text("治愈地详细地址");
							} else if ( healthRptInfor.iFamilyState == "10") {
								$("#sFamilyRemarkBox").show();
							} else {
								$("#sFamilyRemarkBox").hide();
								$(".family_isolation").hide();
							}

							if (healthRptInfor.iNowGoRisks == "1") {
								$(".iNowGoRisks").show();
							} else {
								$(".iNowGoRisks").hide();
							}

							if (healthRptInfor.iRctRisks == "1") {
								$(".iRctRisks").show();
							} else {
								$(".iRctRisks").hide();
							}

							if (healthRptInfor.iRctKey == "1") {
								$(".iRctKey").show();
								if (healthRptInfor.iRctKeyLeave == "1") {
									$(".iRctKeyLeave").show();
								}
							} else {
								$(".iRctKey").hide();
								$(".iRctKeyLeave").hide();
							}

							if (healthRptInfor.iRctOut == "1") {
								$(".iRctOut").show();
								if (healthRptInfor.iRctOutLeave == "1") {
									$(".iRctOutLeave").show();
								}
							} else {
								$(".iRctOut").hide();
								$(".iRctOutLeave").hide();
							}

						}

						$(".beforeTime").text(Global_VAR.beforeTimeText);
						if (Global_VAR.beforeTimeText == "暂无") { // 首次登记
							$(".upload_btn").addClass("weui-btn_disabled");
							Global_VAR.uploadBtnClick = false;
						}
						if (Global_VAR.beforeTimeText == Global_VAR.nowYMD) { // 当日已经填报过
							$(".form_title_tips").show();
							$(".upload_btn").addClass("weui-btn_disabled");
							// $(".change_btn").addClass("weui-btn_disabled");
							Global_VAR.uploadBtnClick = false;
							// Global_VAR.changeBtnClick = false;
							$(".change_btn").text("重新填报");
							$(".change_btn").next().find("span").text("重新");
						}

						form.render();

						Global_FN.initProvincePicker(); // 初始化 区域 组件
						Global_FN.initDatePicker(); // 初始化 日期 组件
						Global_FN.initRadioChange(); // 初始化 单选 组件

						setTimeout(() => { // 隐藏加载
							Global_FN.isShowLoading(false);
						}, 500);
					} else {
						// Global_FN.isShowTopTips("请求出错，请检查网络或授权！", true);
						$("#weuiDialog").show();
					}
				}
			})

		});
	},
	// 保存
	formSubmit () {
		layui.use([], function() {
			let $ = layui.jquery;

			if (Global_VAR.uploadBtnClick) {
				let sDialog = weui.dialog({
					title: '',
					content: '请确定是否一键填报',
					className: 'custom-classname',
					buttons: [{
						label: '取消',
						type: 'default',
						onClick: function () {  }
					}, {
						label: '确定',
						type: 'primary',
						onClick: function () {
							// console.log("确定了");

							$.ajax({
								url: Global_VAR.oneKeyAdd,
								type: "post",
								data: {},
								success: function(res) {
									if(res.code == 1) {
										Global_FN.isShowTopTips("登记成功", true);
										// $("#confirmDialog").hide();
										Global_FN.render();
									} else {
										Global_FN.isShowTopTips(res.msg, false);
									}
								}
							})

						},
					}]
				})
			}
		})
	},
	// 重新填报
	changeData () {
		layui.use([], function() {
			let $ = layui.jquery;

			if (Global_VAR.changeBtnClick) {
				let sDialog = weui.dialog({
					title: '',
					content: '填报的内容务必真实可信，填报后不能进行修改，确定是否填报！',
					className: 'custom-classname',
					buttons: [{
						label: '取消',
						type: 'default',
						onClick: function () {  }
					}, {
						label: '确定',
						type: 'primary',
						onClick: function () {
							let form = layui.form;
							let d = form.val(Global_VAR.formName);

							let req = {
								dRptDate: Global_VAR.healthRptPerson.dRptDate || Global_VAR.nowYMD, // 填报日期
								sPersonName: "11",// d.sPersonName,                 // 姓名
								sPersonCode: "11", // d.sPersonCode,                 // 学工号

								sPhone: d.sPhone,                           // 本人联系电话
								sParentPhone: d.sParentPhone,               // 父母或紧急联系人电话
								iIsGangAoTai: d.iIsGangAoTai,               // 是否港澳台学生
								iIsOversea: d.iIsOversea,                   // 是否留学学生

								sHomeProvName: Global_VAR.healthRptPerson.sHomeProvName,             // 家庭所属省份名称
								sHomeProvCode: Global_VAR.healthRptPerson.sHomeProvCode,             // 家庭所属省份编码
								sHomeCityName: Global_VAR.healthRptPerson.sHomeCityName,             // 家庭所属地市名称
								sHomeCityCode: Global_VAR.healthRptPerson.sHomeCityCode,             // 家庭所属地市编码
								// sHomeCountyName: Global_VAR.healthRptPerson.sHomeCountyName,         // 家庭所属区县名称
								// sHomeCountyCode: Global_VAR.healthRptPerson.sHomeCountyCode,         // 家庭所属区县编码
								sHomeAddr: d.sHomeAddr,                     // 家庭详细住址

								iSelfState: d.iSelfState,                   // 本人健康状况
								iFamilyState: d.iFamilyState,               // 家人健康状况
								sNowProvName: Global_VAR.healthRptInfor.sNowProvName,              // 当前居留省份名称
								sNowProvCode: Global_VAR.healthRptInfor.sNowProvCode,              // 当前居留省份编码
								sNowCityName: Global_VAR.healthRptInfor.sNowCityName,              // 当前居留地市名称
								sNowCityCode: Global_VAR.healthRptInfor.sNowCityCode,              // 当前居留地市编码
								// sNowCountyName: Global_VAR.healthRptInfor.sNowCountyName,          // 当前居留区县名称
								// sNowCountyCode: Global_VAR.healthRptInfor.sNowCountyCode,          // 当前居留区县编码
								sNowAddr: d.sNowAddr,                       // 当前居留详细住址
								iNowGoRisks: d.iNowGoRisks,                 // 当前是否去过高危地区
								iRctRisks: d.iRctRisks,                     // 近14天内，是否火车、高铁、公共汽车经停中、高风险地区
								iRctKey: d.iRctKey,                         // 近14天内是否去过疫情防控重点区域（中、高风险地区）
								iRctOut: d.iRctOut,                         // 近14天内是否去过境外
								iRctTouchKeyMan: d.iRctTouchKeyMan,         // 近14天内是否接触过疫情防控重点区域（中、高风险地区）健康人群
								iRctTouchBackMan: d.iRctTouchBackMan,       // 近14天是否接触过境外人员或境外返穗人员
								iRctTouchDoubtMan: d.iRctTouchDoubtMan,     // 近14天内是否接触过疑似病例/确诊病例（含境外）
								iRptState: "0"
							}

							console.log(req);

							// 本人健康情况
							if (d.iSelfState == "2" || d.iSelfState == "3" || d.iSelfState == "4" || d.iSelfState == "5" || d.iSelfState == "6" || d.iSelfState == "7" || d.iSelfState == "9" ) {
								req.dSelfDate = $(".dSelfDate").text();
								req.sSelfProvName = Global_VAR.healthRptInfor.sSelfProvName;
								req.sSelfProvCode = Global_VAR.healthRptInfor.sSelfProvCode;
								req.sSelfCityName = Global_VAR.healthRptInfor.sSelfCityName;
								req.sSelfCityCode = Global_VAR.healthRptInfor.sSelfCityCode;
								// req.sSelfCountyName = Global_VAR.healthRptInfor.sSelfCountyName;
								// req.sSelfCountyCode = Global_VAR.healthRptInfor.sSelfCountyCode;
								req.sSelfAddr = d.sSelfAddr;

							} else if (d.iSelfState == "10") {
								req.sSelfRemark = d.sSelfRemark;
							}

							// 家人健康情况
							if (d.iFamilyState == "2" || d.iFamilyState == "3" || d.iFamilyState == "4" || d.iFamilyState == "5" || d.iFamilyState == "6" || d.iFamilyState == "7" || d.iFamilyState == "9" ) {
								req.dFamilyDate = $(".dFamilyDate").text();
								req.sFamilyProvName = Global_VAR.healthRptInfor.sFamilyProvName;
								req.sFamilyProvCode = Global_VAR.healthRptInfor.sFamilyProvCode;
								req.sFamilyCityName = Global_VAR.healthRptInfor.sFamilyCityName;
								req.sFamilyCityCode = Global_VAR.healthRptInfor.sFamilyCityCode;
								// req.sFamilyCountyName = Global_VAR.healthRptInfor.sFamilyCountyName;
								// req.sFamilyCountyCode = Global_VAR.healthRptInfor.sFamilyCountyCode;
								req.sFamilyAddr = d.sFamilyAddr;
							} else if (d.iFamilyState == "10") {
								req.sFamilyRemark = d.sFamilyRemark;
							}

							if (d.iNowGoRisks == "1") { // 放假期间是否曾到过中、高风险地区旅游、探亲
								req.dNowGoRisksDate = $(".dNowGoRisksDate").text();
								if (!d.sNowGoRisksTool) {
									Global_VAR.isChechPass = false;
									Global_FN.isShowTopTips("放假期间是否曾到过中、高风险地区旅游、探亲车次不能为空", false);
									return false
								} else {
									req.sNowGoRisksTool = d.sNowGoRisksTool;
								}
							}

							if (d.iRctRisks == "1") { // 近14天内，是否火车、高铁、公共汽车经停中、高风险地区
								req.dRctRisksDate = $(".dRctRisksDate").text();
								if (!d.sRctRisksNum) {
									Global_VAR.isChechPass = false;
									Global_FN.isShowTopTips("近14天内，经停中、高风险地区的车次不能为空", false);
									return false
								} else {
									req.sRctRisksNum = d.sRctRisksNum;
								}
							}

							if (d.iRctKey == "1") { // 近14天内是否去过疫情防控重点区域（中、高风险地区）
								req.iRctKeyLeave = d.iRctKeyLeave;
								if (d.iRctKeyLeave == "1") {
									req.dRctKeyDate = $(".dRctKeyDate").text();
									if (!Global_VAR.healthRptInfor.sRctKeyProvName || !Global_VAR.healthRptInfor.sRctKeyCityName) {
										Global_VAR.isChechPass = false;
										Global_FN.isShowTopTips("离开疫情防控重点区域（中、高风险地区）的城市不能为空", false);
										return false
									} else {
										req.sRctKeyProvName = Global_VAR.healthRptInfor.sRctKeyProvName;
										req.sRctKeyProvCode = Global_VAR.healthRptInfor.sRctKeyProvCode;
										req.sRctKeyCityName = Global_VAR.healthRptInfor.sRctKeyCityName;
										req.sRctKeyCityCode = Global_VAR.healthRptInfor.sRctKeyCityCode;
									}
								}
							}

							if (d.iRctOut == "1") { // 近14天内是否去过境外
								req.iRctOutLeave = d.iRctOutLeave;
								if (d.iRctOutLeave == "1") {
									req.dRctOutDate = $(".dRctOutDate").text();
									if (!Global_VAR.healthRptInfor.sRctOutCityName || !Global_VAR.healthRptInfor.sRctOutCityCode) {
										Global_VAR.isChechPass = false;
										Global_FN.isShowTopTips("离开疫情防控重点区域（境外）的城市不能为空", false);
										return false
									} else {
										req.sRctOutCityName = Global_VAR.healthRptInfor.sRctOutCityName;
										req.sRctOutCityCode = Global_VAR.healthRptInfor.sRctOutCityCode;
									}
								}
							}

							console.log(req);

							$.each(req, function (index, item) {
								console.log(item);
								if (!item) {
									Global_VAR.isChechPass = false;
									Global_FN.isShowTopTips("亲，必填项不能为空，请仔细检查", false);
									return false
								} else {
									Global_VAR.isChechPass = true;
								}
							})

							req.sDegreeCode = d.sDegreeCode; // 人员类型 不用验证
							req.iSex = d.iSex;               // 性别 不用验证
							req.sCollegeName = $(".sCollegeName").text(); // 单位(学院) 不用验证
							req.sCampusName = $(".sCampusName").text(); // 校区名称 不用验证
							req.sDormBuild = d.sDormBuild;   // 楼栋名称 不用验证
							req.sDormRoom = d.sDormRoom;     // 宿舍房号 不用验证
							req.sMajorName = $(".sMajorName").text(); // 专业名称 不用验证
							req.sClassName = $(".sClassName").text(); // 班级名称 不用验证
							req.iInSchool = $(".iInSchool").text();   // 年级 不用验证

							// 本人健康情况
							if (d.iSelfState == "2" || d.iSelfState == "3" || d.iSelfState == "4" || d.iSelfState == "5" || d.iSelfState == "6" || d.iSelfState == "7" || d.iSelfState == "9" ) {
								req.sSelfCountyName = Global_VAR.healthRptInfor.sSelfCountyName || "";
								req.sSelfCountyCode = Global_VAR.healthRptInfor.sSelfCountyCode || "";
							}

							// 家人健康情况
							if (d.iFamilyState == "2" || d.iFamilyState == "3" || d.iFamilyState == "4" || d.iFamilyState == "5" || d.iFamilyState == "6" || d.iFamilyState == "7" || d.iFamilyState == "9" ) {
								req.sFamilyCountyName = Global_VAR.healthRptInfor.sFamilyCountyName || "";
								req.sFamilyCountyCode = Global_VAR.healthRptInfor.sFamilyCountyCode || "";
							}

							req.sHomeCountyName = Global_VAR.healthRptPerson.sHomeCountyName || "";         // 家庭所属区县名称
							req.sHomeCountyCode = Global_VAR.healthRptPerson.sHomeCountyCode || "";         // 家庭所属区县编码

							req.sNowCountyName = Global_VAR.healthRptInfor.sNowCountyName || "";          // 当前居留区县名称
							req.sNowCountyCode = Global_VAR.healthRptInfor.sNowCountyCode || "";

							// console.log(JSON.stringify(req));
							if (Global_VAR.isChechPass) {
								$.ajax({
									url: Global_VAR.add,
									type: "post",
									data: req,
									success: function(res) {
										if(res.code == 1) {
											Global_FN.isShowTopTips("登记成功", true);
											// $("#confirmDialog").hide();
											Global_FN.render();
										} else {
											Global_FN.isShowTopTips(res.msg, false);
										}
									},
									complete: function (xhr) {
										console.log(xhr);
										console.log(xhr.status);
										console.log(xhr.responseText);
										console.log(xhr.responseText.indexOf("!DOCTYPE") != -1);
										if (xhr.responseText.indexOf("!DOCTYPE") != -1) {
											$("#weuiDialog").show();
										}
									}
								})
							}
						}
					}]
				});
			}
		});
	},
	getProvinceData () {
		layui.use([], function() {
			let $ = layui.jquery;

			$.ajax({
				url: Global_VAR.getAreaTree,
				type: "get",
				data: "",
				error: function(data) {
					// console.log("请求失败");
					$("#weuiDialog").show();
				},
				success: function(res) {
					if(res.code == 1) { // 列表赋值
						console.log(res);
						Global_VAR.provinceData = res.data;
						console.log(Global_VAR.provinceData);
						Global_FN.iRctOutExchange(res.data);
					}
				},
			});
		});
	},
	// 初始化 区域 控件
	initProvincePicker () {
		layui.use([], function() {
			let $ = layui.jquery;

			// $('#sCampusName').on('click', function () {	// 校区
			// 	weui.picker(Global_VAR.campusData, {
			// 		onConfirm: function (result) {
			// 			$('.sCampusName').text(result[0].value);
			// 		},
			// 		title: '校区'
			// 	});
			// });

			// $('#sClassName').on('click', function () {	// 班级
			// 		console.log(Global_VAR.classData);
			// 		// $('.iInSchool').text(result[0].value);
			// 	var iInSchool = $('.iInSchool').text();
			// 	if (iInSchool == "") {
			// 		Global_FN.isShowTopTips("请先选择学年", true);
			// 		return false
			// 	} else {
			// 		Global_VAR.classPicker = weui.picker(Global_VAR.classData, {
			// 			onConfirm: function (result) {
			// 				$('.sClassName').text(result[0].value);
			// 			},
			// 			title: '班级'
			// 		});
			// 	}
			// });

			// $('#sCollegeName').on('click', function () {	// 学院
			// 	weui.picker(Global_VAR.collegeData, {
			// 		onConfirm: function (result) {
			// 			$('.sCollegeName').text(result[0].value);
			// 		},
			// 		title: '单位学院'
			// 	});
			// });

			// $('#sMajorName').on('click', function () {	// 专业
			// 	weui.picker(Global_VAR.majorData, {
			// 		onConfirm: function (result) {
			// 			$('.sMajorName').text(result[0].value);
			// 		},
			// 		title: '专业'
			// 	});
			// });

			// $('#iInSchool').on('click', function () {	// 学年
			// 	weui.picker(Global_VAR.nowYearAndMoreList, {
			// 		onConfirm: function (result) {
			// 			$('.iInSchool').text(result[0].value);
			// 			Global_FN.classScreen(result[0].value);
			// 		},
			// 		title: '学年'
			// 	});
			// });

			$('#sSelfProvName').on('click', function () {	// 治愈or隔离地所属区域
				var arr = [];
				if (Global_VAR.healthRptInfor.sSelfProvCode) {
					arr[0] = Global_VAR.healthRptInfor.sSelfProvCode || "";
					arr[1] = Global_VAR.healthRptInfor.sSelfCityCode || "";
					if (Global_VAR.healthRptInfor.sSelfCountyCode && Global_VAR.healthRptInfor.sSelfCountyCode != "*") {
						arr[2] = Global_VAR.healthRptInfor.sSelfCountyCode || "";
					}
				}
				weui.picker(Global_VAR.provinceData, {
					id: "#sSelfProvName",
					defaultValue: arr,
					onConfirm: function (result) {
						if (result.length == 3) {
							$('.sSelfProvName').text(result[0].label + "/" + result[1].label + "/" + result[2].label);
							Global_VAR.healthRptInfor.sSelfCountyName = result[2].label;
							Global_VAR.healthRptInfor.sSelfCountyCode = result[2].value;
						} else {
							$('.sSelfProvName').text(result[0].label + "/" + result[1].label);
							Global_VAR.healthRptInfor.sSelfCountyName = "*";
							Global_VAR.healthRptInfor.sSelfCountyCode = "*";
						}
						Global_VAR.healthRptInfor.sSelfProvName = result[0].label;
						Global_VAR.healthRptInfor.sSelfProvCode = result[0].value;
						Global_VAR.healthRptInfor.sSelfCityName = result[1].label;
						Global_VAR.healthRptInfor.sSelfCityCode = result[1].value;
					},
					title: '地区'
				});
			});

			$('#sFamilyProvName').on('click', function () {	// 家庭 治愈or隔离地所属区域
				var arr = [];
				if (Global_VAR.healthRptInfor.sFamilyProvCode) {
					arr[0] = Global_VAR.healthRptInfor.sFamilyProvCode || "";
					arr[1] = Global_VAR.healthRptInfor.sFamilyCityCode || "";
					if (Global_VAR.healthRptInfor.sFamilyCountyCode && Global_VAR.healthRptInfor.sFamilyCountyCode != "*") {
						arr[2] = Global_VAR.healthRptInfor.sFamilyCountyCode || "";
					}
				}
				weui.picker(Global_VAR.provinceData, {
					id: "#sFamilyProvName",
					defaultValue: arr,
					onConfirm: function (result) {
						// console.log(result);
						if (result.length == 3) {
							$('.sFamilyProvName').text(result[0].label + "/" + result[1].label + "/" + result[2].label);
							Global_VAR.healthRptInfor.sFamilyCountyName = result[2].label;
							Global_VAR.healthRptInfor.sFamilyCountyCode = result[2].value;
						} else {
							$('.sFamilyProvName').text(result[0].label + "/" + result[1].label);
							Global_VAR.healthRptInfor.sFamilyCountyName = "*";
							Global_VAR.healthRptInfor.sFamilyCountyCode = "*";
						}
						Global_VAR.healthRptInfor.sFamilyProvName = result[0].label;
						Global_VAR.healthRptInfor.sFamilyProvCode = result[0].value;
						Global_VAR.healthRptInfor.sFamilyCityName = result[1].label;
						Global_VAR.healthRptInfor.sFamilyCityCode = result[1].value;
					},
					title: '地区'
				});
			});

			$('#sHomeProvName').on('click', function () {	// 家庭所在地所属区域
				var arr = [];
				if (Global_VAR.healthRptPerson.sHomeProvCode) {
					arr[0] = Global_VAR.healthRptPerson.sHomeProvCode || "";
					arr[1] = Global_VAR.healthRptPerson.sHomeCityCode || "";
					if (Global_VAR.healthRptPerson.sHomeCountyCode && Global_VAR.healthRptPerson.sHomeCountyCode != "*") {
						arr[2] = Global_VAR.healthRptPerson.sHomeCountyCode || "";
					}
				}
				weui.picker(Global_VAR.provinceData, {
					id: "#sHomeProvName",
					defaultValue: arr,
					onConfirm: function (result) {
						if (result.length == 3) {
							$('.sHomeProvName').text(result[0].label + "/" + result[1].label + "/" + result[2].label);
							Global_VAR.healthRptPerson.sHomeCountyName = result[2].label;
							Global_VAR.healthRptPerson.sHomeCountyCode = result[2].value;
						} else {
							$('.sHomeProvName').text(result[0].label + "/" + result[1].label);
							Global_VAR.healthRptPerson.sHomeCountyName = "*";
							Global_VAR.healthRptPerson.sHomeCountyCode = "*";
						}
						Global_VAR.healthRptPerson.sHomeProvName = result[0].label;
						Global_VAR.healthRptPerson.sHomeProvCode = result[0].value;
						Global_VAR.healthRptPerson.sHomeCityName = result[1].label;
						Global_VAR.healthRptPerson.sHomeCityCode = result[1].value;
					},
					title: '地区'
				});
			});

			$('#sNowProvName').on('click', function () { // 当前居留地所属区域
				var arr = [];
				if (Global_VAR.healthRptInfor.sNowProvCode) {
					arr[0] = Global_VAR.healthRptInfor.sNowProvCode || "";
					arr[1] = Global_VAR.healthRptInfor.sNowCityCode || "";
					if (Global_VAR.healthRptInfor.sNowCountyCode && Global_VAR.healthRptInfor.sNowCountyCode != "*") {
						arr[2] = Global_VAR.healthRptInfor.sNowCountyCode || "";
					}
				}
				weui.picker(Global_VAR.provinceData, {
					id: "#sNowProvName",
					defaultValue: arr,
					onConfirm: function (result) {
						console.log(result);
						if (result.length == 3) {
							$('.sNowProvName').text(result[0].label + "/" + result[1].label + "/" + result[2].label);
							Global_VAR.healthRptInfor.sNowCountyName = result[2].label;
							Global_VAR.healthRptInfor.sNowCountyCode = result[2].value;
						} else {
							$('.sNowProvName').text(result[0].label + "/" + result[1].label);
							Global_VAR.healthRptInfor.sNowCountyName = "*";
							Global_VAR.healthRptInfor.sNowCountyCode = "*";
						}
						Global_VAR.healthRptInfor.sNowProvName = result[0].label;
						Global_VAR.healthRptInfor.sNowProvCode = result[0].value;
						Global_VAR.healthRptInfor.sNowCityName = result[1].label;
						Global_VAR.healthRptInfor.sNowCityCode = result[1].value;
					},
					title: '地区'
				});
			});

			$('#sRctKeyProvName').on('click', function () { // 离开疫情防控重点区域（中、高风险地区）的城市
				var arr = [];
				if (Global_VAR.healthRptInfor.sRctKeyProvCode) {
					arr[0] = Global_VAR.healthRptInfor.sRctKeyProvCode || "";
					arr[1] = Global_VAR.healthRptInfor.sRctKeyCityCode || "";
				}
				weui.picker(Global_VAR.provinceData, {
					id: "#sRctKeyProvName",
					defaultValue: arr,
					onConfirm: function (result) {
						$('.sRctKeyProvName').text(result[0].label + "/" + result[1].label);
						Global_VAR.healthRptInfor.sRctKeyProvName = result[0].label;
						Global_VAR.healthRptInfor.sRctKeyProvCode = result[0].value;
						Global_VAR.healthRptInfor.sRctKeyCityName = result[1].label;
						Global_VAR.healthRptInfor.sRctKeyCityCode = result[1].value;
					},
					title: '地区'
				});
			});

			$('#sRctOutCityName').on('click', function () {	// 离开疫情防控重点区域（境外）的城市
				var arr = [];
				if (Global_VAR.healthRptInfor.sRctOutCityCode) {
					arr[0] = "90";
					arr[1] = Global_VAR.healthRptInfor.sRctOutCityCode || "";
				}
				weui.picker(Global_VAR.iRctOutData, {
					id: "#sRctOutCityName",
					defaultValue: arr,
					onConfirm: function (result) {
						$('.sRctOutCityName').text(result[0].label + "/" + result[1].label);
						Global_VAR.healthRptInfor.sRctOutCityName = result[1].label;
						Global_VAR.healthRptInfor.sRctOutCityCode = result[1].value;
					},
					title: '地区'
				});
			});


		});
	},
	// 初始化 日期 控件
	initDatePicker () {
		Global_FN.datePickerBindChange("dSelfDate"); // 本人隔离日期
		Global_FN.datePickerBindChange("dFamilyDate"); // 家人隔离日期
		Global_FN.datePickerBindChange("dNowGoRisksDate"); // 放假期间曾到中、高风险地区旅游、探亲的交通工具
		Global_FN.datePickerBindChange("dRctRisksDate"); // 近14天内，经停中、高风险地区的日期
		Global_FN.datePickerBindChange("dRctKeyDate"); // 离开疫情防控重点区域（中、高风险地区）的日期
		Global_FN.datePickerBindChange("dRctOutDate"); // 离开疫情防控重点区域（境外）的日期
	},
	// 初始化 单选 监听
	initRadioChange () {
		layui.use(['form'], function() {
			let form = layui.form;
			let $ = layui.jquery;

			// 本人身体状况
			form.on('radio(iSelfState)', function(data){
				if (data.value == "2" || data.value == "3" || data.value == "4" || data.value == "5" || data.value == "6" || data.value == "7") {
					$(".self_isolation").show();
					$(".dSelfDateLabel").text("隔离日期");
					$(".sSelfProvNameLabel").text("隔离地所属区域");
					$(".sSelfAddrLabel").text("隔离地详细地址");
					$("#sSelfRemarkBox").hide();
				} else if ( data.value == "9") {
					$(".self_isolation").show();
					$(".dSelfDateLabel").text("治愈日期");
					$(".sSelfProvNameLabel").text("治愈地所属区域");
					$(".sSelfAddrlLabel").text("治愈地详细地址");
					$("#sSelfRemarkBox").hide();
				} else if ( data.value == "10") {
					$("#sSelfRemarkBox").show();
					$(".self_isolation").hide();
				} else {
					$("#sSelfRemarkBox").hide();
					$(".self_isolation").hide();
				}
			});

			// 家人身体状况
			form.on('radio(iFamilyState)', function(data){ // data.value 被点击的radio的value值
				if (data.value == "2" || data.value == "3" || data.value == "4" || data.value == "5" || data.value == "6" || data.value == "7") {
					$(".family_isolation").show();
					$(".dFamilyDateLabel").text("隔离日期");
					$(".sFamilyProvNameLabel").text("隔离地所属区域");
					$(".sFamilyAddrLabel").text("隔离地详细地址");
					$("#sFamilyRemarkBox").hide();
				} else if ( data.value == "9") {
					$(".family_isolation").show();
					$(".dFamilyDateLabel").text("治愈日期");
					$(".sFamilyProvNameLabel").text("治愈地所属区域");
					$(".sFamilyAddrLabel").text("治愈地详细地址");
					$("#sFamilyRemarkBox").hide();
				} else if ( data.value == "10") {
					$("#sFamilyRemarkBox").show();
					$(".family_isolation").hide();
				} else {
					$("#sFamilyRemarkBox").hide();
					$(".family_isolation").hide();
				}
			});

			form.on('radio(iRctKey)', function(data){ // 近14天内是否去过疫情防控重点区域（中、高风险地区）
				if (data.value == "1") {
					$(".iRctKey").show();
				} else {
					$(".iRctKey").hide();
					$(".iRctKeyLeave").hide();
				}
			});

			form.on('radio(iRctOut)', function(data){ // 近14天内是否去过境外
				if (data.value == "1") {
					$(".iRctOut").show();
				} else {
					$(".iRctOut").hide();
					$(".iRctOutLeave").hide();
				}
			});

			Global_FN.radioBindChange("iNowGoRisks"); // 放假期间是否曾到过中、高风险地区旅游、探亲
			Global_FN.radioBindChange("iRctRisks"); // 近14天内，是否火车、高铁、公共汽车经停中、高风险地区
			Global_FN.radioBindChange("iRctKeyLeave"); // 是否已离开疫情防控重点区域（中、高风险地区）
			Global_FN.radioBindChange("iRctOutLeave"); // 是否已离开疫情防控重点区域（境外）
		});
	},
	// 日期组件事件绑定
	datePickerBindChange (value) {
		layui.use([], function() {
			let $ = layui.jquery;
			// $('#'+value).prev().text(Global_VAR.nowYMD);
			$('#'+value).on('click', function () {
				weui.datePicker({
					start: 1990,
					end: Global_VAR.nowYMD, // new Date().getFullYear(),
					onConfirm: function (result) {
						$('.'+value).text(result[0].value + "-" + result[1].value + "-" + result[2].value );
					},
					title: '日期'
				});
			});
		});
	},
	// 单选组件事件绑定
	radioBindChange (value) {
		layui.use(['form'], function() {
			let form = layui.form;
			let $ = layui.jquery;
			form.on('radio('+ value +')', function(data){
				data.value == "1" ? $("." + value).show() : $("." + value).hide();
			});
		});
	},
	// 获取当前学年 以及 前7年
	// getNowYearAndMore () {
	// 	let myDate = new Date();
	// 	let nowYear = myDate.getFullYear();
	// 	for (let i = 0; i < 7; i++) {
	//     Global_VAR.nowYearAndMoreList.push(nowYear - i);
	// 	}
	// },
	// 海外数据 转换
	iRctOutExchange (data) {
		layui.use([], function() {
			let $ = layui.jquery;

				var arr = [],
				 tempJson = {};
				$.each(data, function (index, item) {
					if (item.value == "90") {
						// console.log(item);
						tempJson = {};
						tempJson.label = item.label;
						tempJson.value = item.value;
						tempJson.children = item.children;
						arr.push(tempJson);
					}
				});
				Global_VAR.iRctOutData = arr;
		});
	},
	// 校区数据 转换
	// campusExchange (data) {
	// 	layui.use([], function() {
	// 		let $ = layui.jquery;

	// 		let arr = [];
	// 		let tempJson = {};
	// 		$.each(data, function (index, item) {
	// 			tempJson = {};
	// 			tempJson.label = item.sCampusName;
	// 			tempJson.value = item.sCampusName;
	// 			arr[index] = tempJson;
	// 		});
	// 		Global_VAR.campusData = arr;
	// 	});
	// },
	// 班级数据 转换
	// classExchange (data) {
	// 	layui.use([], function() {
	// 		let $ = layui.jquery;

	// 		let arr = [];
	// 		let tempJson = {};
	// 		$.each(data, function (index, item) {
	// 			tempJson = {};
	// 			tempJson.label = item.sClassName;
	// 			tempJson.value = item.sClassName;
	// 			arr[index] = tempJson;
	// 		});
	// 		Global_VAR.classData = arr;
	// 	});
	// },
	// 学院数据 转换
	// collegeExchange (data) {
	// 	layui.use([], function() {
	// 		let $ = layui.jquery;

	// 		let arr = [];
	// 		let tempJson = {};
	// 		$.each(data, function (index, item) {
	// 			tempJson = {};
	// 			tempJson.label = item.sCollegeName;
	// 			tempJson.value = item.sCollegeName;
	// 			arr[index] = tempJson;
	// 		});
	// 		Global_VAR.collegeData = arr;
	// 	});
	// },
	// 专业数据 转换
	// majorExchange (data) {
	// 	layui.use([], function() {
	// 		let $ = layui.jquery;

	// 		let arr = [];
	// 		let tempJson = {};
	// 		$.each(data, function (index, item) {
	// 			tempJson = {};
	// 			tempJson.label = item.sMajorName;
	// 			tempJson.value = item.sMajorName;
	// 			arr[index] = tempJson;
	// 		});
	// 		Global_VAR.majorData = arr;
	// 	});
	// },
	// 班级筛选
	// classScreen (value) {
	// 	layui.use([], function() {
	// 		let $ = layui.jquery;

	// 		let arr = new Array();
	// 		let tempJson = {};
	// 		$.each(classData.data, function (index, item) {
	// 			tempJson = {};
	// 			if (item.iInSchool == value) {
	// 				arr.push(item.sClassName);
	// 			}
	// 		});
	// 		Global_VAR.classData = arr;

	// 		// Global_VAR.classPicker
	// 		$('#sClassName').off("click").on('click', function () {	// 班级

	// 			// var arr2 = ["1111","2222"];
	// 			// console.log(arr2);
	// 			// 				console.log(Global_VAR.classData);
	// 			// weui.picker(Global_VAR.classData);

	// 			weui.picker(Global_VAR.classData, {
	// 				onConfirm: function (result) {
	// 					$('.sClassName').text(result[0].value);
	// 				},
	// 				title: '班级'
	// 			});
	// 		});

	// 	});
	// },
	// 刷新页面
	refresh () {
		window.location.reload();
	},
	// 显示or隐藏 加载效果
	isShowLoading (status) {
		layui.use([], function() {
			let $ = layui.jquery;
			if(status) {
				$(".loading_mask").show();
				$(".loading_tip").show();
			} else {
				$(".loading_mask").hide();
				$(".loading_tip").hide();
			}
		});
	},
	// 显示or隐藏 提示语
	isShowTopTips(text, status) {
		layui.use([], function() {
			let $ = layui.jquery;
			if(status) {
				$("#toastText").text(text);
				$("#weuiToast").show();
				setTimeout(() => {
					$("#weuiToast").hide()
				}, 2000);
			} else {
				weui.topTips(text, 2000);
				// $("#topTips").text(text);
				// $("#topTips").show();
				// setTimeout(() => {
				// 	$("#topTips").hide()
				// }, 2000);
			}
		});
	}
}
