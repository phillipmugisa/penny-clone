document.addEventListener("DOMContentLoaded", () => {
    // detect form field change

    document.querySelectorAll("form").forEach(form => () => {
        form.addEventListener("submit", (e) => {
            e.preventDefault()

            makeCalculation()
        })
    })
    document.querySelectorAll("input[type='number']").forEach(elem => elem.addEventListener("change", () => {
        makeCalculation()
    }));
    
    // toggle salary forms
    document.querySelector("input[type='radio']#employee").addEventListener("change", () => {
        workerTypeChange()
        document.querySelector("#employee_salary_infor_form").classList.add("grid")
        document.querySelector("#employee_deposit_infor_form").classList.add("grid")

        document.querySelector("#employee_salary_infor_form").classList.remove("hidden")
        document.querySelector("#employee_deposit_infor_form").classList.remove("hidden")
        
        makeCalculation()
    })
    document.querySelector("input[type='radio']#independent").addEventListener("change", () => {
        workerTypeChange()
        document.querySelector("#independent_salary_infor_form").classList.add("grid")
        document.querySelector("#independent_deposit_infor_form").classList.add("grid")
        
        document.querySelector("#independent_salary_infor_form").classList.remove("hidden")
        document.querySelector("#independent_deposit_infor_form").classList.remove("hidden")

        makeCalculation()
    })
    const workerTypeChange = () => {
        document.querySelectorAll(".salary_infor_form").forEach(form => {
            form.classList.add("hidden")
            form.classList.remove("grid")
        })
        document.querySelectorAll(".deposit_infor_form").forEach(form => {
            form.classList.add("hidden")
            form.classList.remove("grid")
        })
    }

    const makeCalculation = () => {
        // calculate monthly pension deposit
        let monthlyPensionDeposit = calculateMonthlyPensionDeposit()
        document.querySelector("#monthly_pension_deposit").textContent = monthlyPensionDeposit.toFixed()

        let currentPension = calculateCurrentPension((monthlyPensionDeposit))
        document.querySelectorAll(".expected_total_accumulation").forEach(elem => {
            elem.textContent = (currentPension[0])
        })
        document.querySelectorAll(".expected_monthly_allowance").forEach(elem => {
            elem.textContent = (currentPension[1])
        })

        
        let improvedPension = calculateImprovedPension(monthlyPensionDeposit)
        document.querySelector("#expected_imroved_total_accumulation").textContent = (improvedPension[0]).toFixed()
        document.querySelector("#expected_imroved_monthly_allowance").textContent = (improvedPension[1]).toFixed()
    }

    const calculateMonthlyPensionDeposit = () => {
        let monthlyPensionDeposit
        // 1
        employee_gross_salary= isNaN(parseFloat(document.querySelector("#employee_gross_salary").value)) ? 12000 : parseFloat(document.querySelector("#employee_gross_salary").value)


        // 2
        employee_deposit_percentage= isNaN(parseFloat(document.querySelector("form.grid #employee_deposit_percentage").value)) ? 6.0 : parseFloat(document.querySelector("form.grid #employee_deposit_percentage").value)
        if (document.querySelector("input[type='radio']#employee").checked) {
            employer_contribution_percentage= isNaN(parseFloat(document.querySelector("form.grid #employer_contribution_percentage").value)) ? 6.5 : parseFloat(document.querySelector("form.grid #employer_contribution_percentage").value)
            employer_compensation_percentage= isNaN(parseFloat(document.querySelector("form.grid #employer_compensation_percentage").value)) ? 8.33 : parseFloat(document.querySelector("form.grid #employer_compensation_percentage").value)

            monthlyPensionDeposit = (employee_gross_salary * (employee_deposit_percentage / 100)) + (employee_gross_salary * ((employer_contribution_percentage + employer_compensation_percentage) / 100))

            return monthlyPensionDeposit
        }
        else {
            monthlyPensionDeposit = (employee_gross_salary * (employee_deposit_percentage / 100))
            return monthlyPensionDeposit
        }
    }

    const toPercentage = value => value / 100

    const calculateCurrentPension = (monthlyPensionDeposit) => {
        // 1
        employee_saving= isNaN(parseFloat(document.querySelector("#employee_saving").value)) ? 150000 :parseFloat(document.querySelector("#employee_saving").value)
        // 3
        deposit_management_percentage= isNaN(parseFloat(document.querySelector("form.grid #deposit_management_percentage").value)) ? 4.0 :parseFloat(document.querySelector("form.grid #deposit_management_percentage").value)
        saving_management_percentage= isNaN(parseFloat(document.querySelector("form.grid #saving_management_percentage").value)) ? 0.5 :parseFloat(document.querySelector("form.grid #saving_management_percentage").value)
        expected_annual_return_percentage= isNaN(parseFloat(document.querySelector("form.grid #expected_annual_return_percentage").value)) ? 5.0 :parseFloat(document.querySelector("form.grid #expected_annual_return_percentage").value)
        allowance_coefficient= isNaN(parseFloat(document.querySelector("form.grid #allowance_coefficient").value)) ? 220 :parseFloat(document.querySelector("form.grid #allowance_coefficient").value)

        let total_pension = parseFloat(employee_saving)
        let reduced_deposit = monthlyPensionDeposit * (1 - toPercentage(deposit_management_percentage))
        
        for (let i = 0; i < getYearsOfService(); i++) {
            total_pension = total_pension + (reduced_deposit * 12)
            total_pension = total_pension * (1 + toPercentage(expected_annual_return_percentage))
            // console.log(total_pension)
        }
        // total_pension = total_pension * (1 - toPercentage(saving_management_percentage))




        // 422745

        // 3,135,506 14,252

        monthly_allowance = total_pension / allowance_coefficient
        return [total_pension.toFixed(2), monthly_allowance.toFixed(2)]
    }

    const getYearsOfService = () => {
        let age_of_retirement = 70
        employee_age= isNaN(parseFloat(document.querySelector("form.grid #employee_age").value)) ? 35 : parseInt(document.querySelector("form.grid #employee_age").value)

        if (parseInt(employee_age) >= 50) {
            age_of_retirement = 67
        }
        return age_of_retirement - parseInt(employee_age)
    }

    

    const calculateImprovedPension = (monthlyPensionDeposit) => {
        // 1
        employee_saving= isNaN(parseFloat(document.querySelector("#employee_saving").value)) ? 150000 :parseFloat(document.querySelector("#employee_saving").value)
        
        // 4
        improvement_offer= isNaN(parseFloat(document.querySelector("form.grid #improvement_offer").value)) ? 0 :parseFloat(document.querySelector("form.grid #improvement_offer").value)
        improve_deposit_management_percentage= isNaN(parseFloat(document.querySelector("form.grid #improve_deposit_management_percentage").value)) ? 1.0 :parseFloat(document.querySelector("form.grid #improve_deposit_management_percentage").value)
        improve_saving_management_percentage= isNaN(parseFloat(document.querySelector("form.grid #improve_saving_management_percentage").value)) ? 0.22 :parseFloat(document.querySelector("form.grid #improve_saving_management_percentage").value)
        improve_expected_annual_return_percentage= isNaN(parseFloat(document.querySelector("form.grid #improve_expected_annual_return_percentage").value)) ? 6.0 :parseFloat(document.querySelector("form.grid #improve_expected_annual_return_percentage").value)
        improve_allowance_coefficient= isNaN(parseFloat(document.querySelector("form.grid #improve_allowance_coefficient").value)) ? 220 :parseFloat(document.querySelector("form.grid #improve_allowance_coefficient").value)

        // let saving = parseFloat(employee_saving)
        // let total_deposit = 0
        // for (let i = 0; i < getYearsOfService(); i++) {
        //     saving = saving - ( improve_saving_management_percentage/100 * saving )
        //     saving = saving + (improve_expected_annual_return_percentage/100 * saving)
        
        //     total_deposit = total_deposit + ( monthlyPensionDeposit * 12 ) 
        //     total_deposit = total_deposit - (improve_saving_management_percentage/100 * total_deposit)
        //     total_deposit = total_deposit + (improve_expected_annual_return_percentage/100 * total_deposit)
        // }

        // total_pension = (total_deposit - ( improve_deposit_management_percentage/100 * total_deposit )) + saving
        // monthly_allowance = total_pension / allowance_coefficient

        // return [total_pension, monthly_allowance]

        let total_pension = parseFloat(employee_saving)
        let reduced_deposit = ((100 - improve_deposit_management_percentage)/ 100 * monthlyPensionDeposit )
        for (let i = 0; i < getYearsOfService(); i++) {            
            total_pension = (total_pension + (reduced_deposit * 12))
            total_pension = ((100 + (improve_expected_annual_return_percentage)) / 100 * total_pension)
            total_pension = ((100 - improve_saving_management_percentage) / 100 * total_pension) + 18
        }
        
        monthly_allowance = total_pension / improve_allowance_coefficient
        return [(total_pension), Math.ceil(monthly_allowance)]
    }

    makeCalculation()
})