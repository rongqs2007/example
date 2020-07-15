/**
 * 集合常用工具方法 2020-03-23
 */
const tools = {
	// 获取完整地区代码
	getCompleteCode: (val) => { 
		if (val == undefined || val == null) {
			return []
		} else {
			let gbcode = val
			let statecode = "0000000000"
			let provincecode = gbcode.substr(0, 2)
			let provincefullcode = provincecode + '00000000'
			let citycode = gbcode.substr(2, 2)
			if (citycode != '00') {
				let cityfullcode = provincecode + citycode + '000000'
				let countycode = gbcode.substr(4, 2)
				if (countycode != '00') {
					let countyfullcode = provincecode + citycode + countycode + '0000'
					let streetcode = gbcode.substr(6, 2)
					if (streetcode != '00') {
						let streetfullcode = provincecode + citycode + countycode + streetcode + '00'
						return [ provincefullcode, cityfullcode, countyfullcode, streetfullcode]
					} else {
		            	return [ provincefullcode, cityfullcode, countyfullcode]
					}
				} else {
					return [ provincefullcode, cityfullcode]
				}
			} else {
				return [ provincefullcode]
			}
		}
	},
	/*
	根据身份证号码判断性别/生日/年龄
	15位身份证号码：第7、8位为出生年份(两位数)，第9、10位为出生月份，第11、12位代表出生日
	18位身份证号码：第7、8、9、10位为出生年份(四位数)，第11、第12位为出生月份，
	第13、14位代表出生日期，第17位代表性别，奇数为男，偶数为女。
	*/
	getBrithday: (idCode, num) => {
		// 获取出生日期
		if (num === 1 && idCode) {
			let birthYear, birthMonth, birthDay
			if (idCode.length === 18) {
				birthYear = idCode.slice(6, 10)
				birthMonth = idCode.slice(10, 12)
				birthDay = idCode.slice(12, 14)
				return birthYear + '-' + birthMonth + '-' + birthDay
			}
			if (idCode.length === 15) {
				birthYears = '19'+idCode.slice(6, 8)
				birthMonths = idCode.slice(8, 10)
				birthDays = idCode.slice(10, 12)
				return birthYears + '-' + birthMonths + '-' + birthDays
			}
		}
		// 获取性别
		if (num === 2 && idCode) {
			if (parseInt(idCode.substr(16, 1)) % 2 == 1) {
				return '男'
			} else {
				return '女'
			}
		}
		// 获取年龄
		if (num === 3 && idCode) {
			let myDate = new Date()
			let month = myDate.getMonth() + 1
			let day = myDate.getDate()
			let age = myDate.getFullYear() - idCode.substring(6, 10) - 1
			if (idCode.substring(10, 12) < month || idCode.substring(10, 12) == month && idCode.substring(12, 14) <= day) {
				age++
			}
			return age
		}
	}
}

export default tools
