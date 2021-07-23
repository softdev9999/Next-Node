const crypto = require('crypto');

const CRYPTO_ALGO = 'aes-256-cbc';
const CRYPTO_KEY = '$C3N#RI$C00L1029$C3N#RI$C00L1029';
//const CRYPTO_KEY = crypto.randomBytes(32);
const CRYPTO_IV = crypto.randomBytes(16);

module.exports.encrypt = (text) => {
  let cipher = crypto.createCipheriv(CRYPTO_ALGO, Buffer.from(CRYPTO_KEY), CRYPTO_IV);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  let output = JSON.stringify({
      iv: CRYPTO_IV.toString('hex'),
      data: encrypted.toString('hex')
    });

  return Buffer.from(output).toString('base64');
};

module.exports.decrypt = (text) => {
  let textJSON = Buffer.from(text, 'base64').toString();
  let decOb = JSON.parse(textJSON);

  let iv = Buffer.from(decOb.iv, 'hex');
  let encryptedText = Buffer.from(decOb.data, 'hex');

  let decipher = crypto.createDecipheriv(CRYPTO_ALGO, Buffer.from(CRYPTO_KEY), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
