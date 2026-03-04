# Exception Handling Updates in Views

This document provides a summary of the exception handling blocks added to various views across the backend. It also explains the necessity of these try/except blocks and what happens if they are omitted.

## What Happens Without Exception Handling?

In Django, when you use the `Model.objects.get()` method to retrieve a specific record from the database, it strictly expects to find exactly one matching record. If the record does not exist (for example, if the ID passed from the frontend is invalid, or if the item was already deleted), Django raises a `DoesNotExist` exception.

**If exception handling is NOT added:**
1. **Server Crash (HTTP 500):** The untrapped `DoesNotExist` exception propagates up, causing the view to crash. Django will return a generic `500 Internal Server Error` instead of a helpful error message.
2. **Poor User Experience:** The frontend React application won't know *why* the request failed. It will just see a server error, rather than knowing the specific item wasn't found.
3. **Security/Debugging Issues:** Default 500 error pages often contain sensitive stack traces if debug mode accidentally remains on, or at minimum, make debugging much harder in production since the frontend cannot gracefully display "Item Not Found".

**With Exception Handling added:**
By wrapping the `.get()` calls in a `try...except Model.DoesNotExist:` block, the server safely catches the exact error and manually returns a properly formatted JSON response like `{"error": "Item not found"}` along with an `HTTP 404 Not Found` status. The frontend can then display a user-friendly message, and the server continues running stably.

---

## List of Functions Updated

Below is the list of files and specific view functions where missing exception handling was successfully added:

### 1. `courses/views.py`
- **`TeacherLessonCreateView.post`**: Added `try/except Course.DoesNotExist` around fetching the course to upload lessons to.
- **`StudentLessonVideoView.get`**: Added `try/except Lesson.DoesNotExist` around fetching the lesson to generate video signed URLs.
- **`ReplyCommentsView.post`**: Added `try/except LessonComments.DoesNotExist` around fetching the parent comment.
- **`ToggleCommentLikeView.post`**: Added `try/except LessonComments.DoesNotExist` around fetching the comment to like.
- **`DeleteCommentView.delete`**: Added `try/except LessonComments.DoesNotExist` around fetching the comment to delete.

### 2. `liveclass/views.py`
- **`TeacherLiveClassListView.get`**: Added `try/except TeacherProfile.DoesNotExist` around retrieving the current teacher's profile.
- **`TeacherLiveClassListView.post`**: Added `try/except TeacherProfile.DoesNotExist` around retrieving the current teacher's profile.
- **`TeacherLiveClassDetailView.put`**: Added `try/except TeacherProfile.DoesNotExist` around retrieving the current teacher's profile.
- **`TeacherLiveClassDetailView.delete`**: Added `try/except TeacherProfile.DoesNotExist` around retrieving the current teacher's profile.
- **`VerifyLiveClassPaymentView.post`**: Added `try/except LiveClass.DoesNotExist` around fetching the live class from the payment session.

### 3. `payments/views.py`
- **`StripePaymentSuccessView.post`**: Added dual `try/except` checks for both `Order.DoesNotExist` and `User.DoesNotExist` to prevent crashes when processing successful Stripe webhooks / callbacks.
- **`CreateRazorpayOrderView.post`**: Added `try/except Cart.DoesNotExist` around fetching the user's cart.
- **`RazorpayPaymentVerifyView.post`**: Added `try/except Order.DoesNotExist` when verifying razorpay signatures against the associated order.

### 4. `promotions/views.py`
- **`AdminCouponUpdateView.put`**: Added `try/except Coupon.DoesNotExist` to safely handle coupon update requests for invalid coupon IDs.

### 5. `wallet/views.py`
- **`AdminTransferToTeacherView.post`**: Added `try/except AdminTransaction.DoesNotExist` around fetching the internal wallet transaction.
