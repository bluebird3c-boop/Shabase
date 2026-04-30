# Security Spec

## Data Invariants
1. A product must have title (string), price (number), description (string), imageUrl (string), sellerId (string), and createdAt (timestamp).
2. `sellerId` must match the authenticated user's ID upon creation.
3. Users can only update/delete products they own (where `sellerId` == `request.auth.uid`).
4. Read is allowed for everyone.

## The Dirty Dozen Payloads (for `products/{productId}`)
1. **Unauthenticated Write:** Create product without being signed in.
2. **Identity Spoofing:** Create product where `sellerId` is someone else's UID.
3. **Invalid Type:** Create product where `price` is a string instead of a number.
4. **Missing Field:** Create product missing `imageUrl`.
5. **Additional Field:** Create product with an extra field like `isAdmin: true`.
6. **Shadow Update:** Update product with an additional `isVerified` field.
7. **Identity Mutation:** Update an existing product to change the `sellerId`.
8. **Unauthorized Update:** Update someone else's product.
9. **Unauthorized Delete:** Delete someone else's product.
10. **Type Mutation:** Update `price` to a string.
11. **Size Violation:** Create product with `title` exceeding 250 characters.
12. **Path Poisoning:** Use a 2KB string as a document ID for creation.

## The Test Runner
A complete `firestore.rules.test.ts` file that verifies that all "Dirty Dozen" payloads return PERMISSION_DENIED.
