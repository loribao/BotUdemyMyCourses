const { Builder, By, Key, WebDriver } = require('selenium-webdriver');
const axios = require('axios').default;
const fs = require('fs');
require('geckodriver');

const { meta_file, Usuario } = require("./vars_bot");

(async function example() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        let login = await Login(driver);
        await driver.sleep(5000);
        let historico = await AcessarHistory(login, 'https://www.udemy.com/home/my-courses/');
        let cookies = await historico.manage().getCookies();
        let tokens_info = cookies.filter(x => x.name == "access_token")[0];
        await CrawlingHistorico(tokens_info.value);

    } finally {

        await driver.quit();
    }
})();
const Login = async (driver) => {
    await driver.get('https://www.udemy.com');
    await driver.sleep(3000);
    await driver.findElement(By.css('html body#br.ud-app-loader.udemy.pageloaded.ud-app-loaded div.main-content-wrapper div.c_header.c_header--v6.c_header--desktop.c_header--ia.c_header--ia-.ud-app-loader.ud-app-loaded div.c_header__inner div.c_header__right div.dropdown.dropdown--login.ud-component--header-v6--login-button.hidden-xs.hidden-xxs div button.btn.btn-quaternary')).click()
    await driver.sleep(1000);
    await driver.findElement(By.name('email')).sendKeys(Usuario.usuario);
    await driver.sleep(1000)
    await driver.findElement(By.name('password')).sendKeys(Usuario.senha, Key.RETURN);

    return driver;
}
const AcessarHistory = async (driver, url) => {
    await driver.sleep(1000);
    await driver.get(url);
    return driver;
}
const CrawlingHistorico = async (token) => {
    let data = await axios
        .get("https://www.udemy.com/api-2.0/users/me/subscribed-courses/?ordering=-completion_ratio&fields[course]=@min,visible_instructors,image_240x135,favorite_time,archive_time,completion_ratio,last_accessed_time,enrollment_time,is_practice_test_course,features,num_collections,published_title,is_private,buyable_object_type&fields[user]=@min,job_title&page=1&page_size=1000&max_progress=100&min_progress=80", {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        })
        .then((res) => {
            console.dir(res.data);
            return res.data;
        })
        .catch((err) => console.log(err));

    await fs.writeFileSync(meta_file.path_saida + meta_file.nome_arquivo_saida + '.json', JSON.stringify(data));
    //const mover = require('./move_file');
    //mover.Mover_Pasta();
}