# Testing

This document describes the manual testing completed for Luma Stays, a front-end accommodation booking application built with React, Vite, JavaScript, Bootstrap, CSS, and the Noroff Holidaze API.

Testing focused on the required user stories, responsive behaviour, accessibility, validation, and main user flows for visitors, customers, and venue managers.

## Test Environment

The project was tested locally and on the deployed Netlify site.

### Local Testing

```bash
npm install
npm run dev
npm run format:check
npm run lint
npm run build
```

### Production Testing

Live site:

```text
https://luma-stays.netlify.app/
```

Browsers used:

```text
Google Chrome
Safari
```

Screen sizes tested:

```text
Mobile
Tablet
Desktop
```

## Test Accounts

Manual testing was completed using separate customer and venue manager accounts created through the Noroff API.

For public portfolio use, test account passwords are not committed to the repository.

## Automated Checks

| Check                 | Command                | Result |
| --------------------- | ---------------------- | ------ |
| Prettier format check | `npm run format:check` | Passed |
| ESLint                | `npm run lint`         | Passed |
| Production build      | `npm run build`        | Passed |

## Visitor Tests

| Test                     | Steps                                                   | Expected Result                                                                                       | Result |
| ------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| View homepage            | Open the live site                                      | Homepage loads with hero content and venue preview                                                    | Passed |
| View venues list         | Open `/venues`                                          | Venue cards load from the API                                                                         | Passed |
| Search venues            | Search by venue name, location, amenity, or guest count | Matching venues are displayed                                                                         | Passed |
| Sort venues              | Change sort option                                      | Venues reorder correctly                                                                              | Passed |
| Filter by guests         | Select guest count filter                               | Venues matching the guest count are displayed                                                         | Passed |
| View venue details       | Open a venue card                                       | Venue details page loads with image, description, location, price, rating, features, and booking area | Passed |
| View calendar            | Open a venue detail page                                | Calendar displays available and booked dates                                                          | Passed |
| Logged-out booking state | Open venue details while logged out                     | Guest view card appears with login and register links                                                 | Passed |
| Register link            | Click create account                                    | User is taken to the registration page                                                                | Passed |
| Login link               | Click log in to book                                    | User is taken to the login page                                                                       | Passed |

## Customer Tests

| Test                                    | Steps                                            | Expected Result                                                 | Result |
| --------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------- | ------ |
| Register customer                       | Register with a valid `stud.noroff.no` email     | Customer account is created                                     | Passed |
| Block invalid registration email        | Register with a non-`stud.noroff.no` email       | Validation prevents registration                                | Passed |
| Log in customer                         | Log in with customer account                     | User is logged in and redirected correctly                      | Passed |
| View venue as customer                  | Open venue details while logged in as customer   | Booking card appears                                            | Passed |
| Select dates                            | Choose available check-in and check-out dates    | Selected dates appear in the booking card                       | Passed |
| Select guests                           | Choose guest count and apply selection           | Guest count appears in the booking card                         | Passed |
| Prevent booking without guest selection | Try booking before selecting guests              | Booking is blocked and user receives feedback                   | Passed |
| Create booking                          | Select dates and guests, then submit booking     | Booking is created and confirmation is shown                    | Passed |
| Show existing booking notice            | Return to a venue already booked by the customer | Upcoming booking notice is shown                                | Passed |
| View profile bookings                   | Open profile page                                | Upcoming customer bookings are shown                            | Passed |
| Cancel booking                          | Cancel an upcoming booking                       | Booking is removed from the customer profile                    | Passed |
| Update avatar                           | Submit a valid avatar image URL                  | Avatar updates successfully                                     | Passed |
| Log out customer                        | Click log out                                    | User is logged out and protected content is no longer available | Passed |

## Venue Manager Tests

| Test                            | Steps                                                               | Expected Result                                                     | Result |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| Register venue manager          | Register with venue manager option and valid `stud.noroff.no` email | Venue manager account is created                                    | Passed |
| Log in venue manager            | Log in with venue manager account                                   | User is logged in and can access manager features                   | Passed |
| Create venue                    | Submit valid venue form data                                        | New venue is created                                                | Passed |
| Validate required venue fields  | Submit venue form with missing required fields                      | User-friendly validation errors are shown                           | Passed |
| Validate image URL and alt text | Add image URL without alt text or alt text without image URL        | Form shows matching validation error                                | Passed |
| Edit venue text details         | Edit venue name, description, price, guests, or location            | Venue updates successfully                                          | Passed |
| Preserve existing media on edit | Edit venue details without changing images                          | Existing venue images remain saved                                  | Passed |
| Replace venue media             | Edit image URL and alt text                                         | Updated media is saved                                              | Passed |
| Delete venue                    | Confirm venue deletion                                              | Venue is deleted and user is redirected to profile                  | Passed |
| Cancel delete confirmation      | Open delete confirmation and cancel                                 | Venue is not deleted                                                | Passed |
| View own venue as manager       | Open a venue owned by the logged-in manager                         | Manage this venue card appears                                      | Passed |
| View another manager's venue    | Open a venue owned by another manager                               | Read-only manager card appears, without booking controls            | Passed |
| View managed venue bookings     | Open manager profile                                                | Upcoming bookings for managed venues are shown                      | Passed |
| Update avatar                   | Submit a valid avatar image URL                                     | Avatar updates successfully                                         | Passed |
| Log out manager                 | Click log out                                                       | User is logged out and manager-only actions are no longer available | Passed |

## Responsive Testing

| Area               | Mobile  | Tablet  | Desktop | Result |
| ------------------ | ------- | ------- | ------- | ------ |
| Header/navigation  | Checked | Checked | Checked | Passed |
| Homepage layout    | Checked | Checked | Checked | Passed |
| Venue cards        | Checked | Checked | Checked | Passed |
| Venue details page | Checked | Checked | Checked | Passed |
| Booking card       | Checked | Checked | Checked | Passed |
| Calendar dropdown  | Checked | Checked | Checked | Passed |
| Forms              | Checked | Checked | Checked | Passed |
| Profile page       | Checked | Checked | Checked | Passed |
| Footer             | Checked | Checked | Checked | Passed |

## Accessibility Testing

Accessibility was checked manually and with WAVE.

| Area                | Expected Result                                                            | Result |
| ------------------- | -------------------------------------------------------------------------- | ------ |
| Keyboard navigation | Main links, buttons, and form controls can be reached by keyboard          | Passed |
| Form labels         | Inputs have visible labels or accessible labelling                         | Passed |
| Error messages      | Validation errors are shown near the related fields                        | Passed |
| Button states       | Disabled and loading states are visually clear                             | Passed |
| Image alt text      | Content images use alt text; decorative icons are hidden where appropriate | Passed |
| Colour contrast     | Main text and interface elements have readable contrast                    | Passed |
| WAVE check          | No critical accessibility errors found during final checks                 | Passed |

## Validation and Performance Tools

| Tool             | Purpose                                                     | Result |
| ---------------- | ----------------------------------------------------------- | ------ |
| HTML Validator   | Checked generated HTML validity                             | Passed |
| Lighthouse       | Checked performance, accessibility, best practices, and SEO | Passed |
| WAVE             | Checked accessibility issues                                | Passed |
| Browser DevTools | Checked responsive layout and console errors                | Passed |

## Error and Edge Case Testing

| Test                                    | Expected Result                                            | Result |
| --------------------------------------- | ---------------------------------------------------------- | ------ |
| Invalid login credentials               | User receives an error message                             | Passed |
| Empty required form fields              | User receives validation messages                          | Passed |
| Invalid image URL                       | User receives validation message                           | Passed |
| Missing image alt text                  | User receives validation message                           | Passed |
| API loading state                       | Loader appears while data is loading                       | Passed |
| API error state                         | User-friendly error message appears                        | Passed |
| Unknown venue ID                        | Venue not found message appears                            | Passed |
| Logged-out protected actions            | User is redirected or shown login/register options         | Passed |
| Manager viewing another manager's venue | Read-only state appears instead of booking or edit actions | Passed |

## Post-Submission Improvement Testing

After the original exam submission, the following improvements were tested:

| Improvement                            | Test Completed                                                                                 | Result |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| Improved venue search                  | Search tested across venue names, descriptions, locations, amenities, owners, and guest counts | Passed |
| Media preservation when editing venues | Existing venue images remained after editing text-only details                                 | Passed |
| Manager-specific venue detail states   | Owner manager, other manager, customer, and logged-out states tested                           | Passed |
| Customer existing booking notice       | Upcoming bookings for the same venue appeared on the venue page                                | Passed |
| Route-based code splitting             | App built successfully and routes loaded correctly                                             | Passed |
| Dynamic page metadata                  | Browser titles and social metadata updated per route                                           | Passed |
| Prettier setup                         | `npm run format:check` passed                                                                  | Passed |
| Dependency review                      | Safe dependency updates applied and build still passed                                         | Passed |

## Dependency Audit Note

The project dependencies were reviewed with `npm audit`.

Safe dependency updates were applied. A remaining React Router audit advisory relates to unstable React Server Components APIs. This project is a client-side Vite React app and does not use React Server Components or server actions.

`npm audit fix --force` was not used because forcing dependency changes can introduce breaking changes.

## Known Issues

No critical known issues remain in the tested user flows.

The remaining npm audit advisory is documented above and does not affect the current client-side implementation.
