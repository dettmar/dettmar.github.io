if(true || window.location.href.includes("localhost")) {
	var url = "data/Folkhalsomyndigheten_Covid19_Vaccine.xlsx";
}
else {
	var url = "https://fohm.maps.arcgis.com/sharing/rest/content/items/fc749115877443d29c2a49ea9eca77e9/data";
}


var req = new XMLHttpRequest();
req.open("GET", url, true);
req.responseType = "arraybuffer";

let processData = (bytes) => {
	return XLSX.read(new Uint8Array(bytes), { type: "array" });
}
var workbook;
var allCharts = [];
var dose1color = "rgba(255, 206, 86, 1)"
var dose2color = "#3e95cd"
var colorFade = 0.6

req.onload = function(e) {
	workbook = processData(req.response)
	allCharts = drawCharts(workbook)

	var dateInfo = workbook.SheetNames.filter(name => name.includes("2021"))
	if(dateInfo.length) {
		selector.updated_info = "Data uppdaterad " + dateInfo.pop().replace("FOHM", "").trim()
	}
}

let drawCharts = (workbook) => {
	var isPecentage = (selector.selected_measure === "Andel")
	var scaling = (isPecentage ? 100 : 1)

	var dosisStats = [
		["Dos 1", "dos1"],
		["Dos 2", "dos2"]
	]
	var data = XLSX.utils.sheet_to_json(workbook.Sheets["Vaccinerade tidsserie"])

	var totPies = dosisStats.map(stat => {
		var [dose, idDose] = stat
		var lastYearData = data.filter(row => row["År"] === new Date().getFullYear().toString())
		var latestWeek = lastYearData.map(row => row.Vecka).sort().pop()
		selector.latest_week = latestWeek
		var lastWeekData = lastYearData.filter(row => row.Vecka === latestWeek && row.Region === selector.selected_region)
		var lastWeekDoseData = lastWeekData.filter(row => row.Dosnummer === dose)
		var ysDoseRelative = lastWeekDoseData.map(row => row[`Andel vaccinerade`])
		var ysDoseAbsolute = lastWeekDoseData.map(row => row[`Antal vaccinerade`])
		var labels = ["Tagit " + dose, "Ej tagit " + dose]
		var relativeVaccinations = ysDoseRelative[0]
		ysDoseRelative.push(1.0-relativeVaccinations)
		
		
		var absoluteMissing = ysDoseAbsolute[0]/Math.max(relativeVaccinations, 1e-5)
		ysDoseAbsolute.push(absoluteMissing)
		
		ysDoseRelative = ysDoseRelative.map(val => val*100)

		return new Chart(document.getElementById("overall_chart_"+idDose).getContext('2d'), {
			type: 'pie',
			data: {
			labels: labels,
			datasets: [{
				label: "Andel vaccinerade",
				backgroundColor: [Chart.helpers.color(idDose === "dos1" ? dose1color : dose2color).alpha(colorFade).rgbString()],
				data: ysDoseRelative
			}]
			},
			options: {
				tooltips: {
					callbacks: {
						title: function(tooltipItems, data) {
							return data.labels[tooltipItems[0].index]
						},
						label: function(tooltipItems, data, val) {
							return "Antal: " + parseInt(ysDoseAbsolute[tooltipItems.index], 10).toLocaleString() +
									" personer, " + ysDoseRelative[tooltipItems.index].toFixed(2) + "%"
						}
					}
				},
			}
		});
	})





	
	var subsetData = data.filter(row => row.Region === selector.selected_region)
	var xs = subsetData.filter(row => row.Dosnummer === "Dos 1").map(row => parseInt(row.Vecka, 10))
	var ysDos1 = subsetData.filter(row => row.Dosnummer === "Dos 1").map(row => row[`${selector.selected_measure} vaccinerade`] * scaling)
	var ysDos2 = subsetData.filter(row => row.Dosnummer === "Dos 2").map(row => row[`${selector.selected_measure} vaccinerade`] * scaling)
	var progressionChart = new Chart(document.getElementById('main_line_chart').getContext('2d'), {
		type: 'line',
		data: {
			labels: xs,
			datasets: [{
				label: "Dos 1",
				data: ysDos1,
				borderColor: dose1color,
				backgroundColor: Chart.helpers.color(dose1color).alpha(colorFade/2).rgbString()
			},
			{
				label: "Dos 2",
				data: ysDos2,
				borderColor: dose2color,
				backgroundColor: Chart.helpers.color(dose2color).alpha(colorFade/1.5).rgbString()
			}]
		},
		options: {
				//responsive: false,
				tooltips: {
					callbacks: {
						title: function(tooltipItems, data) {
							//Return value for title
							return 'Vecka: ' + tooltipItems[0].xLabel;
						},
						label: function(tooltipItems, data) {
							return data.datasets[tooltipItems.datasetIndex].label +': ' +
								(isPecentage ? tooltipItems.yLabel.toFixed(2) : tooltipItems.yLabel.toLocaleString()) +
								(isPecentage ? "%" : " personer");
						}
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							suggestedMin: 0,
							//suggestedMax: 1e7,//10099265,
							callback: function(value, index, values) {
								return (isPecentage ? value+"%" : value.toLocaleString());
							}
						}
					}],
					xAxes: [{
						ticks: {
							callback: function(value, index, values) {
								return 'Vecka ' + value;
							}
						}
					}]
			},
		}
	});


	subsetData = subsetData.filter(row => row.Dosnummer === selector.selected_dose)
	
	var periodWeeks = Math.min(selector.selected_period, subsetData.length - 1)
	var currentPercentage = subsetData[subsetData.length-1]["Andel vaccinerade"]
	var previousPercentage = subsetData[subsetData.length-1-periodWeeks]["Andel vaccinerade"]

	var derivative = (currentPercentage-previousPercentage)/periodWeeks
	var percentageMissing = (1.0 - currentPercentage)
	var weeksToGo = percentageMissing / derivative

	var weekMs = 7 * 24 * 60 * 60 * 1000
	var now = Date.now()
	selector.completed_date = new Date(now + weeksToGo * weekMs).toISOString().substring(0, 10)
	selector.vaccination_rate = derivative


	var midsummer = new Date(2021, 5, 24).getTime()
	var timeLeft = (midsummer - now)
	selector.supposed_rate  = percentageMissing / (timeLeft / weekMs)




	if(selector.region_options.length < 2) {
		let restRegions = data
			.map(row => row.Region)
			.filter((v, i, a) => a.indexOf(v) === i || name === "| Sverige |")
			.sort()
			.map(name => {
				return { text: name.replaceAll("|", "").trim(), value: name }
			})
			
		selector.region_options = [{ text: 'Sverige', value: "| Sverige |" }, ...restRegions]
	}
	
	if(selector.selected_scope === "Region") {
		var lastYearData = data.filter(row => row["År"] === new Date().getFullYear().toString())
		var latestWeek = lastYearData.map(row => row.Vecka).sort().pop()
		var lastWeekData = lastYearData.filter(row => row.Vecka === latestWeek)
									.sort((a,b) => b[`${selector.selected_measure} vaccinerade`] - a[`${selector.selected_measure} vaccinerade`])
		var allRegions = lastWeekData.map(row => row.Region).filter((v, i, a) => a.indexOf(v) === i)
		var ysDos1 = lastWeekData.filter(row => row.Dosnummer === "Dos 1").map(row => row[`${selector.selected_measure} vaccinerade`]*scaling)
		var ysDos2 = lastWeekData.filter(row => row.Dosnummer === "Dos 2").map(row => row[`${selector.selected_measure} vaccinerade`]*scaling)
		
	}
	else {

		data = XLSX.utils.sheet_to_json(workbook.Sheets["Vaccinerade kommun"])
			.sort((a,b) => b[`${selector.selected_measure}_dos1`] - a[`${selector.selected_measure}_dos1`])
		allRegions = data.map(row => row.KnNamn)
		var ysDos1 = data.map(row => row[`${selector.selected_measure}_dos1`]*scaling)
		var ysDos2 = data.map(row => row[`${selector.selected_measure}_dos2`]*scaling)
	}

	
	var horizontalBar = new Chart(document.getElementById('barchart').getContext('2d'), {
				type: 'horizontalBar',
				data: {
			labels: allRegions,
			datasets: [{
				label: 'Dos 1',
				borderColor: dose1color,
				backgroundColor: Chart.helpers.color(dose1color).alpha(colorFade).rgbString(),
				data: ysDos1
			}, {
				label: 'Dos 2',
				borderColor: dose2color,
				backgroundColor: Chart.helpers.color(dose2color).alpha(colorFade).rgbString(),
				data: ysDos2
			}]

		},
		options: {
			// Elements options apply to all of the options unless overridden in a dataset
			// In this case, we are setting the border of each horizontal bar to be 2px wide
			elements: {
				rectangle: {
					borderWidth: 3,
				}
			},
			responsive: true,
			legend: {
				position: 'top',
			},
			scales: {
						xAxes: [{
							ticks: {
								suggestedMMax: 100,
								//suggestedMax: 1e6//10099265
							}
						}]
				},
				tooltips: {
					callbacks: {
						title: function(tooltipItems, data) {
							//Return value for title
							return  selector.selected_scope + ': ' + tooltipItems[0].yLabel;
						},
						label: function(tooltipItems, data) {
							return data.datasets[tooltipItems.datasetIndex].label +': ' +
								(isPecentage ? tooltipItems.xLabel.toFixed(2) : tooltipItems.xLabel.toLocaleString()) +
								(isPecentage ? "%" : " personer");
						}
					}
				},
				scales: {

					xAxes: [{
						ticks: {
							callback: function(value, index, values) {
								return (isPecentage ? value+"%" : value.toLocaleString());
							}
						}
					}]
			},
		}
	});

	
	
	
	
	
	var ageData = XLSX.utils.sheet_to_json(workbook.Sheets["Vaccinerade ålder"])
	var regionAgeData = ageData.filter(row => row.Region === selector.selected_region && row["Åldersgrupp"] !== "Totalt")
	var ageGroups = regionAgeData.map(row => row["Åldersgrupp"]).filter((v, i, a) => a.indexOf(v) === i)
	var ysDos1 = regionAgeData.filter(row => row.Dosnummer === "Dos 1").map(row => row[`${selector.selected_measure} vaccinerade`]*scaling)
	var ysDos2 = regionAgeData.filter(row => row.Dosnummer === "Dos 2").map(row => row[`${selector.selected_measure} vaccinerade`]*scaling)
	
	var ageBar = new Chart(document.getElementById('barchart_age').getContext('2d'), {
				type: 'bar',
				data: {
			labels: ageGroups,
			datasets: [{
				label: 'Dos 1',
				borderColor: dose1color,
				backgroundColor: Chart.helpers.color(dose1color).alpha(colorFade).rgbString(),
				data: ysDos1
			},
			{
				label: 'Dos 2',
				borderColor: dose2color,
				backgroundColor: Chart.helpers.color(dose2color).alpha(colorFade).rgbString(),
				data: ysDos2
			}]

		},
		options: {
			// Elements options apply to all of the options unless overridden in a dataset
			// In this case, we are setting the border of each horizontal bar to be 2px wide
			elements: {
				rectangle: {
					borderWidth: 3,
				}
			},
			responsive: true,
			legend: {
				position: 'top',
			},
			tooltips: {
				callbacks: {
					title: function(tooltipItems, data) {
						//Return value for title
						return 'Ålder: ' + tooltipItems[0].xLabel + (tooltipItems[0].xLabel.endsWith("9") ? ' år' : '');
					},
					label: function(tooltipItems, data) {
						//return data.datasets[tooltipItems.datasetIndex].label +': ' + tooltipItems.yLabel + ' personer';
						return data.datasets[tooltipItems.datasetIndex].label +': ' +
								(isPecentage ? tooltipItems.yLabel.toFixed(2) : tooltipItems.yLabel.toLocaleString()) +
								(isPecentage ? "%" : " personer");
					}
				}
			},
			scales: {
						xAxes: [{
							ticks: {
								suggestedMMax: 100,
								//suggestedMax: 1e6//10099265
							}
						}],
						yAxes: [{
							ticks: {
								callback: function(value, index, values) {
									return (isPecentage ? value+"%" : value.toLocaleString());
								}
							}
						}]
				},
		}
	});



	var genderData = XLSX.utils.sheet_to_json(workbook.Sheets["Vaccinerade kön"])
	genderData = genderData
		.filter(row => row["Kön"] !== "Totalt")
	var genderCategories = genderData.map(row => row["Kön"] + " " +  row.Dosnummer)
		
		var ysDos1 = genderData.filter(row => row.Dosnummer === "Dos 1").map(row => row["Antal vaccinerade"])
		var ysDos2 = genderData.filter(row => row.Dosnummer === "Dos 2").map(row => row["Antal vaccinerade"])
		
	var genDonut = new Chart(document.getElementById("gender_chart").getContext('2d'), {
		type: 'doughnut',
		data: {
		  labels: genderCategories,
		  datasets: [{
			label: "Antal vaccinerade",
			borderColor: ["white"],
			borderWidth: 3,
			backgroundColor: ["rgba(255, 206, 86, .8)", "rgba(220, 160, 60, .8)", Chart.helpers.color("#d33").alpha(colorFade).rgbString(), Chart.helpers.color("#a01").alpha(colorFade).rgbString()],
			data: [...ysDos1, ...ysDos2]
		  }]
		},
		options: {
		}
	});


	var genderStats = [
		["Kvinnor", "women"],
		["Män", "men"]
	]

	var genPies = genderStats.map(stat => {
		var [displayGender, idGender] = stat
		var genderCategoryData = genderData.filter(row => row["Kön"] === displayGender)
		var labels = genderCategoryData.map(row => row["Kön"] + " " +  row.Dosnummer)
		
		var ysDos1 = genderCategoryData.filter(row => row.Dosnummer === "Dos 1").map(row => row["Andel vaccinerade"]*100)
		var ysDos2 = genderCategoryData.filter(row => row.Dosnummer === "Dos 2").map(row => row["Andel vaccinerade"]*100)
		var ys = [...ysDos1, ...ysDos2]
		var total = Math.max(...ys)
		ys = ys.map(val => {
			if(val == total) return total - Math.min(...ys)
			else return val
		})
		ys.push(100-total)
		labels.push(displayGender + " Ovaccinerade")
		
		return new Chart(document.getElementById("gender_chart_relative_"+idGender).getContext('2d'), {
			type: 'pie',
			data: {
			labels: labels,
			datasets: [{
				label: "Andel vaccinerade",
				backgroundColor: [Chart.helpers.color(dose1color).alpha(colorFade).rgbString(), Chart.helpers.color(dose2color).alpha(colorFade).rgbString()],
				data: ys
			}]
			},
			options: {

			}
		});

	})


	return [...totPies, progressionChart, horizontalBar, ageBar, genDonut, ...genPies]
}





var selector = new Vue({
	el: '#main',
	data: {
		updated_info: "",
		completed_date: "",
		vaccination_rate: 0,
		supposed_rate: 0,
		latest_week: 9,
		selected_region: '| Sverige |',
		region_options: [{ text: 'Sverige', value: "| Sverige |" }],
		selected_measure: "Andel",
		measure_options: [{ text: 'Antal', value: "Antal" }, { text: 'Andel', value: "Andel" }],
		selected_scope: "Region",
		scope_options: [{ text: 'Region', value: "Region" }, { text: 'Kommun', value: "Kommun" }],
		selected_cumulation: "Total",
		cumulation_options: [{ text: 'Total', value: "Total" }, { text: 'Ny', value: "Ny" }],
		selected_period: 4,
		period_options: [{ text: 'sedan start', value: 1000 }, { text: 'den senaste månaden', value: 4 }, { text: 'den senaste veckan', value: 1 }],
		selected_dose: 'Dos 1',
		dose_options: [{ text: 'dos 1', value: 'Dos 1' }, { text: 'dos 2', value: 'Dos 2' }]
	},
	methods: {
        onChange(event) {
            allCharts.forEach(chart => chart.destroy())
			allCharts = drawCharts(workbook)
        }
    },

})

req.send();
