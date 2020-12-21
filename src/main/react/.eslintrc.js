module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',],
    plugins: [
        "react",
        '@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-var-requires': 0,
    }
};
