let shell = require('shelljs');

exports.Mover_Pasta = () => {
    shell.mv(source = './data', dest = '../../STOREGE/Udemy');
    shell.mkdir(dir = 'data');
}
;