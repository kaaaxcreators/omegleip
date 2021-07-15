module.exports = {
    env: {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "webextensions": true
    },
    extends: "eslint:recommended",
    parserOptions: {
        "ecmaVersion": 12
    },
    rules: {
        curly: 'warn'
    }
};
