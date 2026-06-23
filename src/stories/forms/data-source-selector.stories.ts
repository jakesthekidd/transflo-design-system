import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/* ──────────────────────────────────────────────────────────────────────────────
 * PUBLIC TYPES — import these into your app to type-check the data you pass in.
 *
 * Example usage in an Angular component:
 *
 *   <app-data-source-selector
 *     [workflow]="workflowData"
 *     [geotab]="geotabItems"
 *     [json]="jsonPayload"
 *     [multiSelect]="false"
 *     [(ngModel)]="selected"
 *     (selectionChange)="onSelectionChange($event)"
 *   />
 *
 *   workflowData: WorkflowData = { segments: [...] };
 *   geotabItems:  GeotabItem[]  = [...];
 *   jsonPayload:  JsonNode[]    = [...];
 *   selected:     SelectedValue | SelectedValue[] = null;
 * ────────────────────────────────────────────────────────────────────────────── */

// ─── Inline SVG icons (color tokenized via currentColor) ───────────────────────
const SEGMENT_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.88647 8.73218C5.25674 8.7312 5.98485 8.7319 6.39331 8.74487C6.79981 8.75779 6.90748 8.78187 7.02222 8.84058C7.26893 8.96683 7.44242 9.14523 7.57202 9.40112C7.5984 9.45322 7.6155 9.51653 7.62769 9.61597C7.63982 9.71513 7.64809 9.85769 7.65405 10.072C7.666 10.5019 7.6687 11.2346 7.6687 12.5183C7.6687 13.8017 7.666 14.5338 7.65405 14.9636C7.64809 15.1779 7.63981 15.3205 7.62769 15.4197C7.6155 15.5191 7.59839 15.5824 7.57202 15.6345C7.44195 15.8913 7.26837 16.0686 7.01929 16.196C6.90251 16.2558 6.80094 16.2804 6.3894 16.2917C5.97659 16.3031 5.23415 16.3006 3.82202 16.2937L0.868896 16.28L0.837646 16.2791L0.811279 16.2615L0.587646 16.1033C0.453327 16.0086 0.290556 15.831 0.221436 15.699C0.191979 15.6427 0.167079 15.5901 0.14917 15.4968C0.132211 15.4084 0.122045 15.2839 0.11499 15.0818C0.100842 14.6763 0.100342 13.9353 0.100342 12.4919V9.50952L0.11792 9.48413L0.244873 9.29956C0.40902 9.06193 0.565097 8.92248 0.791748 8.81714C0.841756 8.7939 0.917451 8.78095 1.02417 8.77124C1.13505 8.76116 1.29342 8.75341 1.51929 8.7478C1.97212 8.73657 2.70462 8.73302 3.88647 8.73218ZM12.5173 8.73218C13.8879 8.7312 14.6167 8.73189 15.0251 8.74487C15.431 8.75778 15.5385 8.78203 15.6531 8.84058C15.8999 8.96683 16.0742 9.14518 16.2039 9.40112C16.2302 9.4532 16.2464 9.5166 16.2585 9.61597C16.2707 9.71513 16.2799 9.85763 16.2859 10.072C16.2978 10.5019 16.2996 11.2346 16.2996 12.5183C16.2996 13.8017 16.2978 14.5338 16.2859 14.9636C16.2799 15.178 16.2707 15.3205 16.2585 15.4197C16.2464 15.519 16.2302 15.5824 16.2039 15.6345C16.0738 15.8912 15.9001 16.0687 15.6511 16.196C15.5343 16.2558 15.4328 16.2804 15.0212 16.2917C14.6085 16.3031 13.8655 16.3006 12.4529 16.2937L9.50073 16.28L9.46851 16.2791L9.44312 16.2615L9.21851 16.1033C9.08423 16.0086 8.92235 15.8309 8.85327 15.699C8.82379 15.6427 8.79893 15.5902 8.78101 15.4968C8.76404 15.4084 8.75291 15.2839 8.74585 15.0818C8.7317 14.6763 8.7312 13.9353 8.7312 12.4919V9.50952L8.74878 9.48413L8.87671 9.29956C9.04083 9.062 9.19695 8.92246 9.42358 8.81714C9.47353 8.79398 9.54865 8.78094 9.65503 8.77124C9.76596 8.76114 9.92492 8.75341 10.1511 8.7478C10.6039 8.73657 11.3358 8.73302 12.5173 8.73218ZM3.8689 9.72046C2.75662 9.72046 2.08563 9.72326 1.68237 9.73413C1.4805 9.73957 1.34841 9.74715 1.26245 9.75659C1.21942 9.76132 1.19066 9.76649 1.17163 9.77124C1.15126 9.77633 1.14943 9.77852 1.15405 9.77515C1.14627 9.78082 1.14551 9.78259 1.14526 9.78296C1.14389 9.78515 1.13971 9.79337 1.13452 9.81519C1.12283 9.86461 1.11284 9.95683 1.1062 10.1394C1.09305 10.5013 1.09253 11.1873 1.09253 12.5183C1.09253 13.8574 1.0929 14.5422 1.1062 14.9021C1.11292 15.084 1.12274 15.1745 1.13452 15.2224C1.13969 15.2433 1.14406 15.2508 1.14526 15.2527C1.14539 15.2529 1.1464 15.2528 1.14722 15.2537L1.14819 15.2546C1.15866 15.257 1.17528 15.2605 1.198 15.2634C1.24308 15.2691 1.30694 15.2741 1.38745 15.2791C1.54833 15.289 1.77087 15.2967 2.03491 15.3025C2.56292 15.3141 3.25384 15.3171 3.94214 15.3132C4.63036 15.3093 5.31547 15.2985 5.83276 15.281C6.09136 15.2723 6.30696 15.2624 6.45972 15.2507C6.53633 15.2449 6.6536 15.2382 6.6355 15.2322V15.2312C6.63864 15.1949 6.6423 15.1427 6.64526 15.0759C6.65133 14.9391 6.65644 14.7432 6.66089 14.4978C6.6698 14.0068 6.6753 13.3187 6.67554 12.5076V9.83569L6.60132 9.78394C6.59631 9.78048 6.57515 9.76912 6.49487 9.75854C6.41618 9.7482 6.29343 9.7399 6.09741 9.73413C5.7063 9.72263 5.03585 9.72046 3.8689 9.72046ZM12.5007 9.72046C11.3883 9.72046 10.7175 9.72326 10.3142 9.73413C10.1124 9.73957 9.9803 9.74716 9.89429 9.75659C9.85145 9.7613 9.8225 9.76651 9.80347 9.77124C9.78309 9.77633 9.78029 9.77852 9.78491 9.77515C9.77716 9.7808 9.77734 9.78259 9.7771 9.78296C9.77583 9.78495 9.77069 9.79279 9.76538 9.81519C9.75369 9.86461 9.74468 9.95683 9.73804 10.1394C9.72489 10.5013 9.72339 11.1873 9.72339 12.5183C9.72339 13.8574 9.72474 14.5422 9.73804 14.9021C9.74476 15.084 9.75458 15.1745 9.76636 15.2224C9.77165 15.2438 9.77604 15.2511 9.7771 15.2527C9.77724 15.2529 9.77811 15.2527 9.77905 15.2537L9.78003 15.2546C9.79043 15.257 9.80637 15.2606 9.82886 15.2634C9.87387 15.2691 9.93786 15.2741 10.0183 15.2791C10.1792 15.289 10.4026 15.2967 10.6667 15.3025C11.1947 15.3141 11.8849 15.3171 12.573 15.3132C13.2614 15.3093 13.9472 15.2985 14.4646 15.281C14.7232 15.2723 14.9388 15.2624 15.0916 15.2507C15.1683 15.2449 15.2274 15.2382 15.2673 15.2322V15.2312C15.2705 15.1949 15.2732 15.1427 15.2761 15.0759C15.2822 14.9391 15.2883 14.7432 15.2927 14.4978C15.3016 14.0068 15.3062 13.3187 15.3064 12.5076V9.83569L15.2332 9.78394C15.2283 9.78057 15.2068 9.7692 15.1257 9.75854C15.0471 9.74823 14.9248 9.73989 14.7292 9.73413C14.3381 9.72263 13.6677 9.72046 12.5007 9.72046ZM3.88647 0.100342C5.25673 0.0993682 5.98485 0.100062 6.39331 0.113037C6.79981 0.125955 6.90748 0.151015 7.02222 0.209717C7.26871 0.335929 7.44248 0.513598 7.57202 0.769287C7.59841 0.821392 7.6155 0.884676 7.62769 0.984131C7.63984 1.0833 7.64809 1.22566 7.65405 1.44019C7.66601 1.87001 7.6687 2.60246 7.6687 3.88647C7.6687 5.17038 7.666 5.90296 7.65405 6.33276C7.64809 6.54713 7.63983 6.6897 7.62769 6.78882C7.61552 6.88792 7.5983 6.95069 7.57202 7.00269C7.44197 7.25941 7.26832 7.43681 7.01929 7.56421C6.9025 7.62394 6.80095 7.64952 6.3894 7.66089C5.97659 7.67227 5.23413 7.66976 3.82202 7.66284L0.868896 7.64819H0.837646L0.811279 7.62964L0.587646 7.47144C0.453327 7.37676 0.290556 7.19915 0.221436 7.06714C0.19203 7.01095 0.167055 6.95814 0.14917 6.86499C0.132242 6.77661 0.122038 6.65184 0.11499 6.44995C0.100851 6.04438 0.100342 5.30331 0.100342 3.86011V0.878662L0.11792 0.852295L0.244873 0.668701C0.40905 0.431009 0.565049 0.290656 0.791748 0.185303C0.841757 0.162081 0.9175 0.149112 1.02417 0.139404C1.13505 0.129327 1.29343 0.121571 1.51929 0.115967C1.97212 0.104735 2.70462 0.101185 3.88647 0.100342ZM12.5496 0.100342C12.6949 0.104347 12.8496 0.133793 12.9539 0.198975C12.975 0.212201 13.0041 0.236216 13.0359 0.263428C13.0695 0.292232 13.112 0.330044 13.1609 0.374756C13.2589 0.464387 13.3863 0.584843 13.533 0.725342C13.8267 1.00674 14.1991 1.37079 14.5691 1.73804C14.9391 2.10535 15.3069 2.47652 15.5925 2.77026C15.7352 2.91697 15.8581 3.04441 15.95 3.14331C16.0388 3.23894 16.1064 3.31513 16.1316 3.35327C16.3557 3.69225 16.3561 4.07759 16.1326 4.41577C16.1052 4.45708 16.0348 4.53606 15.9421 4.6355C15.8461 4.73853 15.7181 4.87105 15.5701 5.02222C15.274 5.32459 14.8942 5.70378 14.5144 6.0769C14.1347 6.44999 13.7548 6.81806 13.4587 7.09741C13.3108 7.23703 13.1828 7.35538 13.0867 7.44116C13.0387 7.48392 12.9976 7.51943 12.9656 7.54565C12.9497 7.5586 12.9352 7.56974 12.9226 7.57886C12.9117 7.58675 12.8962 7.59726 12.8806 7.60425C12.6794 7.69462 12.3823 7.68694 12.1589 7.59448C12.1307 7.58274 12.0959 7.55726 12.0652 7.53296C12.0301 7.50521 11.9862 7.46734 11.9353 7.42261C11.8332 7.33284 11.6996 7.20938 11.5457 7.06421C11.2377 6.77373 10.8457 6.39282 10.4568 6.00659C10.0678 5.62029 9.68052 5.22803 9.38257 4.91675C9.23385 4.76137 9.10677 4.62555 9.01245 4.52026C8.9653 4.46763 8.92545 4.42153 8.89526 4.38452C8.86726 4.35017 8.8415 4.31688 8.82788 4.29077C8.70597 4.05623 8.70083 3.78998 8.8064 3.53394C8.81338 3.51716 8.82413 3.50052 8.83276 3.48804C8.84254 3.47392 8.85505 3.45764 8.8689 3.44019C8.8968 3.40502 8.93411 3.36071 8.97925 3.30933C9.06998 3.20605 9.19456 3.07024 9.34155 2.91382C9.63568 2.60082 10.022 2.20237 10.4119 1.80737C10.8017 1.41234 11.1962 1.01993 11.5066 0.720459C11.6615 0.570971 11.7963 0.444241 11.8992 0.351318C11.9506 0.304894 11.9947 0.265963 12.03 0.237061C12.0614 0.211374 12.0955 0.185035 12.1228 0.172607C12.2431 0.117875 12.4026 0.0963344 12.5496 0.100342ZM12.4275 1.13257C12.3416 1.20979 12.2229 1.32045 12.0828 1.45483C11.8025 1.72349 11.4375 2.08331 11.075 2.44604C10.7124 2.80882 10.3523 3.1744 10.0837 3.45483C9.9495 3.59503 9.83862 3.71367 9.76147 3.79956C9.73064 3.83389 9.70576 3.86229 9.68726 3.88452C9.70448 3.90492 9.72658 3.93145 9.75464 3.96265C9.8283 4.04454 9.9352 4.15936 10.0681 4.29858C10.3339 4.57697 10.7014 4.95136 11.1052 5.35522L12.5056 6.75562L13.2546 6.03589C13.8629 5.45072 14.4063 4.91323 14.7976 4.51343C14.9933 4.3135 15.1506 4.14825 15.2585 4.02905C15.3125 3.96941 15.3529 3.92209 15.3796 3.88843L15.3806 3.8855C15.3637 3.86575 15.3417 3.84049 15.3142 3.8103C15.2414 3.73035 15.1354 3.61748 15.0037 3.4812C14.7404 3.20885 14.3768 2.84177 13.9763 2.44604C13.5758 2.05032 13.2035 1.69081 12.9265 1.43042C12.788 1.30018 12.6733 1.19589 12.5916 1.12378C12.56 1.09591 12.5339 1.07329 12.5134 1.0564C12.491 1.07505 12.4626 1.10104 12.4275 1.13257ZM3.8689 1.08862C2.75662 1.08862 2.08563 1.09143 1.68237 1.10229C1.4805 1.10774 1.34842 1.11531 1.26245 1.12476C1.21946 1.12948 1.19066 1.13466 1.17163 1.1394C1.16252 1.14168 1.15688 1.1432 1.15405 1.14429C1.14627 1.14996 1.14551 1.15075 1.14526 1.15112C1.14406 1.15299 1.13992 1.16151 1.13452 1.18433C1.12285 1.23386 1.11283 1.32615 1.1062 1.50854C1.09307 1.87056 1.09253 2.55588 1.09253 3.88647C1.09253 5.22537 1.09291 5.91029 1.1062 6.27026C1.11292 6.45216 1.12274 6.54268 1.13452 6.59058C1.14002 6.61293 1.14438 6.62054 1.14526 6.62183C1.14543 6.62208 1.14638 6.62201 1.14722 6.6228L1.14819 6.62378C1.15866 6.62613 1.17528 6.62871 1.198 6.63159C1.24308 6.6373 1.30692 6.64226 1.38745 6.64722C1.54833 6.65712 1.77086 6.66486 2.03491 6.67065C2.56292 6.68223 3.25384 6.68628 3.94214 6.68237C4.63036 6.67847 5.31547 6.66667 5.83276 6.64917C6.09137 6.64042 6.30696 6.63055 6.45972 6.6189C6.53635 6.61304 6.6536 6.60641 6.6355 6.60034V6.59937C6.63863 6.5631 6.64231 6.51157 6.64526 6.44507C6.65133 6.30829 6.65643 6.11246 6.66089 5.86694C6.6698 5.37593 6.6753 4.68714 6.67554 3.87573V1.20386L6.60132 1.1521C6.59607 1.14853 6.57449 1.13719 6.49487 1.12671C6.41618 1.11637 6.29343 1.10806 6.09741 1.10229C5.70629 1.09079 5.03584 1.08862 3.8689 1.08862Z" fill="var(--c-surface-500)" stroke="var(--c-surface-500)" stroke-width="0.2"/></svg>`;

const STEP_SVG = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.99767 8.01115C4.06119 7.93924 4.11905 7.86733 4.18257 7.80113C4.80081 7.17335 5.41338 6.53985 6.04296 5.92462C6.15072 5.81847 6.33336 5.73401 6.48196 5.73401C9.88171 5.72373 13.2826 5.7283 16.6823 5.72145C16.9364 5.72145 17.0011 5.80706 17 6.05246C16.9898 7.35483 16.9886 8.65606 17 9.95843C17.0022 10.2301 16.9058 10.2917 16.6551 10.2917C13.2644 10.2849 9.87377 10.2883 6.4831 10.2815C6.35491 10.2815 6.19383 10.2347 6.10535 10.149C5.42018 9.48131 4.74976 8.79874 4.07594 8.12073C4.05098 8.09562 4.03283 8.06138 3.99767 8.01115ZM15.8724 9.16057C15.8724 8.4643 15.8633 7.81825 15.8769 7.17335C15.8826 6.93479 15.8066 6.8663 15.5718 6.86744C12.6893 6.87429 9.80797 6.87201 6.92551 6.87429C6.83362 6.87429 6.70998 6.86744 6.65439 6.91995C6.28231 7.27722 5.92385 7.64932 5.53816 8.04083C5.85238 8.35016 6.15073 8.62638 6.42865 8.92315C6.5886 9.09323 6.75535 9.16856 6.99584 9.16742C9.83974 9.15943 12.6836 9.16171 15.5287 9.16171C15.6296 9.16171 15.7317 9.16171 15.8713 9.16171L15.8724 9.16057Z" fill="var(--c-surface-500)"/><path d="M3.94435 2.26179C4.49566 1.72874 5.06626 1.25162 5.54383 0.693464C5.99645 0.164984 6.49217 -0.0119375 7.18528 0.00061823C9.57543 0.0462753 11.9678 0.0223054 14.3591 0.0120325C14.6438 0.0108911 14.7255 0.0816596 14.721 0.375006C14.704 1.67737 14.7096 2.98088 14.7176 4.28325C14.7187 4.50126 14.6677 4.58345 14.434 4.58231C11.7784 4.57546 9.12167 4.57888 6.46608 4.57432C6.36058 4.57432 6.22219 4.55491 6.15413 4.48757C5.43379 3.77532 4.72481 3.05165 3.94322 2.26064L3.94435 2.26179ZM5.55291 2.33712C5.91251 2.69324 6.25736 3.04366 6.61469 3.37924C6.67368 3.43403 6.78825 3.44887 6.87673 3.44887C9.03206 3.45229 11.1874 3.44887 13.3427 3.45572C13.5401 3.45572 13.6059 3.39751 13.6025 3.19547C13.5911 2.6065 13.59 2.01638 13.6025 1.42626C13.607 1.2014 13.514 1.15917 13.3155 1.15917C11.1794 1.16487 9.0434 1.16259 6.90622 1.16373C6.82341 1.16373 6.71111 1.15688 6.66233 1.20482C6.29252 1.56666 5.93519 1.94219 5.55291 2.33598V2.33712Z" fill="var(--c-surface-500)"/><path d="M3.94208 13.6761C4.37428 13.2651 4.79514 12.8725 5.20805 12.4707C5.49278 12.1933 5.75596 11.8909 6.05203 11.6261C6.16547 11.5245 6.3447 11.4423 6.49331 11.4423C9.13982 11.4309 11.7863 11.4366 14.4329 11.4309C14.6541 11.4309 14.7221 11.4914 14.7199 11.7231C14.7085 13.0448 14.7085 14.3666 14.7199 15.6884C14.7221 15.9224 14.6586 16 14.4192 16C11.7727 15.9932 9.12621 15.9966 6.4797 15.9909C6.36626 15.9909 6.21765 15.9658 6.14392 15.8927C5.42926 15.1873 4.72707 14.4693 3.94435 13.6772L3.94208 13.6761ZM5.5461 13.7423C5.9125 14.1064 6.25622 14.4568 6.61355 14.7935C6.67254 14.8483 6.78598 14.8643 6.87446 14.8643C9.02979 14.8677 11.1851 14.8643 13.3393 14.8711C13.5333 14.8711 13.6059 14.8186 13.6014 14.6143C13.59 14.0253 13.5889 13.4352 13.6014 12.8451C13.6059 12.6225 13.5174 12.5746 13.3166 12.5757C11.1806 12.5814 9.04454 12.578 6.90849 12.5814C6.81774 12.5814 6.69523 12.5814 6.63964 12.6351C6.27437 12.9889 5.92271 13.3565 5.54496 13.7423H5.5461Z" fill="var(--c-surface-500)"/><path d="M1.12881 1.20026C1.7981 1.20482 2.2303 1.64085 2.22916 2.30972C2.22803 2.97289 1.75613 3.44316 1.10386 3.43403C0.450451 3.4249 -0.00783908 2.94778 0.0001016 2.28347C0.00804228 1.63058 0.460661 1.19569 1.12881 1.20026Z" fill="var(--c-surface-500)"/><path d="M0.000100849 8.02827C-0.0033023 7.35141 0.439106 6.90853 1.11974 6.90739C1.78902 6.90739 2.22576 7.33999 2.22916 8.00773C2.23257 8.67204 1.76633 9.14573 1.11293 9.14117C0.468601 9.13774 0.00350424 8.6709 0.00123547 8.02713L0.000100849 8.02827Z" fill="var(--c-surface-500)"/><path d="M1.12768 12.6145C1.79696 12.618 2.22916 13.054 2.22803 13.7229C2.2269 14.386 1.75613 14.8574 1.10386 14.8483C0.450451 14.8392 -0.00783908 14.3621 0.0001016 13.6977C0.00804228 13.0437 0.459526 12.61 1.12768 12.6134V12.6145Z" fill="var(--c-surface-500)"/></svg>`;

const ACTION_SVG = `<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.44531 0C7.14841 0 10.8516 0 14.5547 0C14.6672 0.0261978 14.758 0.0825494 14.8242 0.18022C15.2944 0.874725 15.7657 1.56844 16.2367 2.26242C16.7389 3.00246 17.2423 3.74163 17.742 4.48325C17.8369 4.624 17.9578 4.75086 18 4.92308V5.02857C17.9792 5.10374 17.9488 5.17283 17.8984 5.23472C17.4642 5.76879 17.0314 6.304 16.5982 6.83886C15.8121 7.80967 15.026 8.78066 14.2399 9.75138C13.4122 10.7734 12.5844 11.7953 11.7567 12.8171C10.9557 13.8062 10.1542 14.7946 9.35473 15.7849C9.27466 15.884 9.19081 15.9713 9.06152 15.9999H8.93848C8.81112 15.9712 8.72622 15.8875 8.648 15.7884C8.44919 15.5368 8.24546 15.289 8.04357 15.0397C7.24351 14.052 6.44326 13.0644 5.64328 12.0765C4.75752 10.9828 3.87211 9.88888 2.98644 8.79516C2.03985 7.62637 1.09336 6.45749 0.146074 5.28932C0.0818262 5.21029 0.0197754 5.13169 0 5.02857C0 4.99341 0 4.95824 0 4.92308C0.0246973 4.86576 0.0420996 4.80378 0.075498 4.75209C0.17543 4.59719 0.281777 4.44642 0.3854 4.29389C1.31546 2.92466 2.24552 1.55543 3.17522 0.185934C3.22251 0.116308 3.27973 0.0597802 3.35856 0.0282198C3.38669 0.016967 3.41631 0.00931868 3.44531 0ZM12.0238 6.00299H5.97612C6.98353 8.53503 7.98908 11.0624 8.99473 13.5899C8.99842 13.5894 9.0022 13.5888 9.00589 13.5884C10.0113 11.0615 11.0167 8.53451 12.0238 6.00299ZM5.97428 4.49591H12.0288C11.9646 4.37679 11.9035 4.26356 11.8425 4.15033C11.3749 3.28149 10.9071 2.41275 10.4402 1.54356C10.4241 1.51358 10.4068 1.49969 10.37 1.49969C9.45466 1.50092 8.53937 1.50084 7.62416 1.49996C7.59199 1.49996 7.57494 1.50971 7.55974 1.53811C7.03793 2.51077 6.51524 3.4829 5.99282 4.45521C5.98623 4.46752 5.98113 4.48079 5.97428 4.49591ZM5.8761 1.50075C5.85 1.50075 5.83163 1.50075 5.81335 1.50075C5.26263 1.50075 4.71182 1.50127 4.16109 1.49969C4.11794 1.4996 4.09307 1.51226 4.06951 1.54848C3.89865 1.81125 3.72551 2.07244 3.55298 2.33407C3.08619 3.04202 2.6194 3.74989 2.1527 4.45793C2.14515 4.46945 2.13899 4.48193 2.12985 4.49802C2.14796 4.49899 2.15938 4.50013 2.17072 4.50013C2.85478 4.50013 3.53883 4.49996 4.22288 4.50101C4.2547 4.50101 4.26894 4.48879 4.28282 4.46294C4.80375 3.49442 5.32529 2.52624 5.84666 1.55807C5.85545 1.5418 5.86362 1.52519 5.8761 1.50075ZM15.8728 4.50031C15.8597 4.47851 15.8527 4.46585 15.8447 4.4538C15.2038 3.48176 14.5627 2.50989 13.9225 1.53732C13.9039 1.50901 13.8843 1.50004 13.8515 1.50004C13.2934 1.50101 12.7353 1.50075 12.1772 1.50075C12.162 1.50075 12.1467 1.50075 12.1236 1.50075C12.1372 1.52686 12.146 1.54479 12.1555 1.56246C12.6762 2.52941 13.1971 3.49626 13.717 4.46365C13.7326 4.49275 13.7504 4.50092 13.782 4.50092C14.4601 4.50004 15.1384 4.50022 15.8165 4.50022C15.8322 4.50022 15.8479 4.50031 15.8728 4.50031ZM11.5168 10.9609C11.5196 10.9628 11.5223 10.9647 11.525 10.9666C12.7604 9.31385 13.9959 7.6611 15.2374 6.00009C15.2063 6.00009 15.1874 6.00009 15.1686 6.00009C14.6867 6.00009 14.2049 6.00009 13.723 6.00009C13.6619 6.00009 13.6193 6.02842 13.5952 6.0851C12.9808 7.52607 12.3665 8.96703 11.7522 10.4081C11.6736 10.5924 11.5952 10.7766 11.5168 10.9609ZM6.47525 10.967C6.47789 10.9656 6.48062 10.9641 6.48325 10.9627C6.47903 10.9524 6.47481 10.942 6.47042 10.9317C6.25395 10.4242 6.03747 9.91657 5.82082 9.40905C5.34164 8.28633 4.86211 7.1636 4.3839 6.04044C4.36975 6.00712 4.35155 5.9993 4.31815 5.99938C3.81735 6.00035 3.31646 6 2.81566 6.00018C2.80055 6.00018 2.78543 6.00176 2.76161 6.00316C4.00324 7.66277 5.23925 9.3149 6.47525 10.967Z" fill="var(--c-surface-500)"/></svg>`;

export type DataSourceType = 'workflow' | 'geotab' | 'json';

export interface WorkflowAction {
  id: string;
  label: string;
  /** Free-form action type label — shown as a pill on the right. e.g. "Input", "Multi Select", "Date Time" */
  actionType: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  actions: WorkflowAction[];
}

export interface WorkflowSegment {
  id: string;
  label: string;
  steps: WorkflowStep[];
}

export interface WorkflowData {
  segments: WorkflowSegment[];
}

export interface GeotabItem {
  id: string;
  label: string;
}

/** Recursive JSON node — `type === 'object'` means it has children; `'array'` indicates a list value that will expand at render-time. */
export interface JsonNode {
  key: string;
  type: 'object' | 'array' | 'string' | 'numeric' | 'date-time' | 'boolean';
  /** Children for `object` types. For `array` types, children describe the shape of each item. */
  children?: JsonNode[];
  /** Set to true when this leaf is itself an array of primitives. */
  isArray?: boolean;
}

export interface SelectedValue {
  source: DataSourceType;
  id: string;
  label: string;
  /** For workflow/JSON, the breadcrumb of parent labels leading to this item. */
  path?: string[];
  /** Action type (workflow) or JSON value type. */
  type?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-data-source-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <div class="dss-wrap" [class.dss-wrap--open]="open">

      <!-- Trigger -->
      <button
        *ngIf="!embedded"
        type="button"
        class="dss-trigger"
        [class.dss-trigger--open]="open"
        (click)="toggle()"
      >
        <span class="dss-trigger__label" [class.dss-trigger__label--placeholder]="!hasSelection()">
          <ng-container *ngIf="hasSelection(); else placeholderTpl">
            <span *ngIf="multiSelect">{{ selectionLabels().join(', ') }}</span>
            <span *ngIf="!multiSelect">{{ singleLabel() }}</span>
          </ng-container>
          <ng-template #placeholderTpl>{{ placeholder }}</ng-template>
        </span>
        <i class="pi" [ngClass]="open ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
      </button>

      <!-- Dialog -->
      <div *ngIf="open" class="dss-dialog" [class.dss-dialog--embedded]="embedded" #dialog>

        <!-- Tabs -->
        <div class="dss-dialog__header">
          <div class="dss-dialog__title">Select Data Type</div>
          <div class="dss-tabs">
            <button
              *ngFor="let tab of visibleTabs()"
              type="button"
              class="dss-tab"
              [class.dss-tab--active]="activeTab === tab.id"
              (click)="setTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="dss-search">
          <i class="pi pi-search"></i>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Search..."
            class="dss-search__input"
          />
        </div>

        <!-- Workflow Data -->
        <div *ngIf="activeTab === 'workflow'" class="dss-list">
          <ng-container *ngFor="let seg of filteredSegments()">
            <div class="dss-row dss-row--segment" (click)="toggleExpand('seg-' + seg.id)">
              <i class="pi" [ngClass]="isExpanded('seg-' + seg.id) ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              <span class="dss-row__icon dss-row__icon--svg" [innerHTML]="icons.segment"></span>
              <span class="dss-row__label">{{ seg.label }}</span>
            </div>

            <ng-container *ngIf="isExpanded('seg-' + seg.id)">
              <ng-container *ngFor="let step of seg.steps">
                <div class="dss-row dss-row--step" (click)="toggleExpand('step-' + step.id)">
                  <i class="pi" [ngClass]="isExpanded('step-' + step.id) ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
                  <span class="dss-row__icon dss-row__icon--svg" [innerHTML]="icons.step"></span>
                  <span class="dss-row__label">{{ step.label }}</span>
                </div>

                <ng-container *ngIf="isExpanded('step-' + step.id)">
                  <div
                    *ngFor="let action of step.actions"
                    class="dss-row dss-row--action"
                    [class.dss-row--selected]="isSelected(action.id)"
                    (click)="select({
                      source: 'workflow',
                      id: action.id,
                      label: action.label,
                      type: action.actionType,
                      path: [seg.label, step.label]
                    })"
                  >
                    <input
                      *ngIf="multiSelect"
                      type="checkbox"
                      class="dss-row__checkbox"
                      [checked]="isSelected(action.id)"
                      (click)="$event.stopPropagation()"
                      (change)="select({
                        source: 'workflow',
                        id: action.id,
                        label: action.label,
                        type: action.actionType,
                        path: [seg.label, step.label]
                      })"
                    />
                    <span class="dss-row__icon dss-row__icon--svg" [innerHTML]="icons.action"></span>
                    <span class="dss-row__label">{{ action.label }}</span>
                    <span class="dss-action-pill">{{ action.actionType }}</span>
                  </div>
                </ng-container>
              </ng-container>
            </ng-container>
          </ng-container>
        </div>

        <!-- Geotab -->
        <div *ngIf="activeTab === 'geotab'" class="dss-list">
          <div
            *ngFor="let item of filteredGeotab()"
            class="dss-row dss-row--flat"
            [class.dss-row--selected]="isSelected(item.id)"
            (click)="select({ source: 'geotab', id: item.id, label: item.label })"
          >
            <input
              *ngIf="multiSelect"
              type="checkbox"
              class="dss-row__checkbox"
              [checked]="isSelected(item.id)"
              (click)="$event.stopPropagation()"
              (change)="select({ source: 'geotab', id: item.id, label: item.label })"
            />
            <span class="dss-row__label">{{ item.label }}</span>
          </div>
        </div>

        <!-- JSON Payload -->
        <div *ngIf="activeTab === 'json'" class="dss-list">
          <div class="dss-json-title">Select JSON Value</div>
          <ng-container *ngTemplateOutlet="jsonNodes; context: { nodes: filteredJson(), depth: 0, path: [] }"></ng-container>
        </div>

        <!-- Recursive JSON template -->
        <ng-template #jsonNodes let-nodes="nodes" let-depth="depth" let-path="path">
          <ng-container *ngFor="let node of nodes">
            <div
              class="dss-json-row"
              [class.dss-json-row--object]="node.type === 'object'"
              [class.dss-json-row--array]="node.type === 'array'"
              [class.dss-json-row--selected]="isSelected(buildJsonId(path, node.key))"
              [style.paddingLeft.px]="12 + depth * 16"
              (click)="onJsonClick(node, path)"
            >
              <input
                *ngIf="multiSelect && node.type !== 'object'"
                type="checkbox"
                class="dss-row__checkbox"
                [checked]="isSelected(buildJsonId(path, node.key))"
                (click)="$event.stopPropagation()"
                (change)="select({
                  source: 'json',
                  id: buildJsonId(path, node.key),
                  label: node.key,
                  type: node.type,
                  path: path
                })"
              />
              <i
                *ngIf="node.type === 'object' || node.type === 'array'"
                class="pi"
                [ngClass]="isExpanded('json-' + buildJsonId(path, node.key)) ? 'pi-chevron-down' : 'pi-chevron-right'"
              ></i>
              <span class="dss-json-key">"{{ node.key }}":</span>
              <span class="dss-json-type">{{ jsonTypeLabel(node) }}</span>
              <span *ngIf="node.type === 'object'" class="dss-json-count">
                {{ '{' + (node.children?.length || 0) + '}' }}
              </span>
              <span *ngIf="node.type === 'array'" class="dss-json-count">
                {{ '[' + (node.children?.length || 0) + ']' }}
              </span>
              <button
                *ngIf="node.type === 'array'"
                class="dss-json-insert-array"
                type="button"
                (click)="$event.stopPropagation(); select({
                  source: 'json',
                  id: buildJsonId(path, node.key),
                  label: node.key,
                  type: 'array',
                  path: path
                })"
              >Insert as list</button>
            </div>
            <ng-container *ngIf="node.type === 'object' && isExpanded('json-' + buildJsonId(path, node.key))">
              <ng-container
                *ngTemplateOutlet="jsonNodes; context: { nodes: node.children || [], depth: depth + 1, path: path.concat(node.key) }"
              ></ng-container>
            </ng-container>
          </ng-container>
        </ng-template>

        <!-- Footer (multi-select only) -->
        <div *ngIf="multiSelect" class="dss-footer">
          <button class="dss-footer__btn dss-footer__btn--ghost" type="button" (click)="clearSelection()">Clear</button>
          <button class="dss-footer__btn dss-footer__btn--primary" type="button" (click)="close()">Done</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dss-wrap {
      position: relative;
      font-family: sans-serif;
      max-width: 420px;
    }

    /* ── Trigger ── */
    .dss-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 14px;
      background: var(--c-surface-0);
      border: 1.5px solid var(--c-blue-700);
      border-radius: 6px;
      color: var(--c-blue-700);
      font-size: 14px;
      cursor: pointer;
      transition: box-shadow 0.15s, border-color 0.15s;
    }
    .dss-trigger:hover {
      box-shadow: 0 2px 4px rgba(30, 64, 175, 0.12);
    }
    .dss-trigger--open {
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.18);
    }
    .dss-trigger__label {
      color: var(--c-blue-700);
      font-weight: 500;
    }
    .dss-trigger__label--placeholder {
      color: var(--c-surface-800);
      font-weight: 400;
    }
    .dss-trigger i {
      color: var(--c-blue-700);
      font-size: 12px;
    }

    /* ── Dialog ── */
    .dss-dialog {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: 420px;
      max-height: 540px;
      background: var(--c-surface-0);
      border-radius: 8px;
      box-shadow: 0 10px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000;
    }
    .dss-dialog--embedded {
      position: static;
      top: auto;
      left: auto;
    }

    .dss-dialog__header {
      background: var(--c-surface-200);
      padding: 10px 14px 14px 14px;
    }
    .dss-dialog__title {
      font-size: 11px;
      color: var(--c-surface-800);
      margin-bottom: 8px;
    }

    /* ── Tabs ── */
    .dss-tabs {
      display: flex;
      gap: 0;
      background: var(--c-surface-0);
      border-radius: 6px;
      padding: 4px;
      border: 1px solid var(--c-surface-400);
    }
    .dss-tab {
      flex: 1;
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: var(--c-surface-800);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .dss-tab:hover { color: var(--c-bluegray-700); }
    .dss-tab--active,
    .dss-tab--active:hover {
      background: var(--c-blue-500);
      color: var(--c-surface-0);
    }

    /* ── Search ── */
    .dss-search {
      position: relative;
      padding: 12px 14px;
      background: var(--c-surface-0);
      border-bottom: 1px solid var(--c-surface-400);
    }
    .dss-search i {
      position: absolute;
      left: 26px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--c-surface-600);
      font-size: 13px;
    }
    .dss-search__input {
      width: 100%;
      padding: 8px 12px 8px 34px;
      border: 1px solid var(--c-surface-500);
      border-radius: 6px;
      background: var(--c-surface-0);
      font-size: 13px;
      outline: none;
    }
    .dss-search__input:focus {
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 3px rgba(36, 116, 187, 0.15);
    }

    /* ── List ── */
    .dss-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .dss-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      cursor: pointer;
      transition: background 0.12s;
      font-size: 13px;
      color: var(--c-bluegray-900);
    }
    .dss-row:hover { background: var(--c-surface-100); }
    .dss-row--selected { background: var(--c-blue-50); color: var(--c-blue-700); font-weight: 600; }
    .dss-row--selected:hover { background: var(--c-blue-100); }

    .dss-row__icon { font-size: 14px; color: var(--c-surface-800); }
    .dss-row__icon--action { color: var(--c-surface-800); }
    .dss-row__icon--svg {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      color: var(--c-surface-800);
    }
    .dss-row__icon--svg svg {
      width: 100%;
      height: 100%;
    }
    .dss-row__label { flex: 1; }

    .dss-row__checkbox {
      margin: 0;
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--c-blue-500);
    }

    .dss-row--step { padding-left: 28px; }
    .dss-row--action { padding-left: 50px; }

    .dss-action-pill {
      padding: 3px 10px;
      background: var(--c-blue-100);
      color: var(--c-blue-700);
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    /* ── JSON ── */
    .dss-json-title {
      padding: 8px 14px 4px 14px;
      font-size: 12px;
      color: var(--c-surface-800);
    }
    .dss-json-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.12s;
    }
    .dss-json-row:hover { background: var(--c-surface-100); }
    .dss-json-row--selected { background: var(--c-blue-50); }
    .dss-json-row--object .dss-json-key { color: var(--c-blue-700); font-weight: 700; }

    .dss-json-key {
      display: inline-block;
      padding: 2px 8px;
      background: var(--c-red-100);
      color: var(--c-red-700);
      border-radius: 10px;
      font-weight: 600;
    }
    .dss-json-type {
      display: inline-block;
      padding: 2px 8px;
      background: var(--c-green-100);
      color: var(--c-green-700);
      border-radius: 10px;
      font-weight: 600;
    }
    .dss-json-count {
      margin-left: auto;
      color: var(--c-surface-800);
      font-size: 11px;
      font-weight: 600;
    }

    .dss-json-row--object .dss-json-key {
      background: var(--c-blue-500);
      color: var(--c-surface-0);
    }
    .dss-json-row--array .dss-json-key {
      background: var(--c-purple-600);
      color: var(--c-surface-0);
    }
    .dss-json-row--array .dss-json-type {
      background: var(--c-purple-100);
      color: var(--c-purple-800);
    }
    .dss-json-insert-array {
      margin-left: 6px;
      padding: 2px 8px;
      background: var(--c-purple-600);
      color: var(--c-surface-0);
      border: none;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      font-family: sans-serif;
    }
    .dss-json-insert-array:hover { background: var(--c-purple-700); }

    /* ── Footer ── */
    .dss-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 10px 14px;
      border-top: 1px solid var(--c-surface-400);
      background: var(--c-surface-100);
    }
    .dss-footer__btn {
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .dss-footer__btn--ghost {
      background: transparent;
      color: var(--c-surface-800);
    }
    .dss-footer__btn--ghost:hover {
      background: var(--c-surface-400);
      color: var(--c-bluegray-700);
    }
    .dss-footer__btn--primary {
      background: var(--c-blue-500);
      color: var(--c-surface-0);
    }
    .dss-footer__btn--primary:hover {
      background: var(--c-blue-700);
    }
  `],
})
export class DataSourceSelectorComponent {
  constructor(private sanitizer: DomSanitizer) {
    const replace = (svg: string) => svg.replace(/var(--c-surface-500)/g, 'currentColor');
    this.icons = {
      segment: this.sanitizer.bypassSecurityTrustHtml(replace(SEGMENT_SVG)),
      step:    this.sanitizer.bypassSecurityTrustHtml(replace(STEP_SVG)),
      action:  this.sanitizer.bypassSecurityTrustHtml(replace(ACTION_SVG)),
    };
  }

  icons: { segment: SafeHtml; step: SafeHtml; action: SafeHtml };

  // ─── Inputs ─────────────────────────────────────────────────────────────────
  /** Workflow tree data — exactly 3 levels: Segments > Steps > Actions. */
  @Input() workflow: WorkflowData = { segments: [] };
  /** Flat list of selectable items. */
  @Input() geotab: GeotabItem[] = [];
  /** Recursive JSON tree — `type: 'object'` items can have children. */
  @Input() json: JsonNode[] = [];

  /** Allow selecting multiple items with checkboxes. Defaults to single-select. */
  @Input() multiSelect = false;
  /** Trigger placeholder text when nothing is selected. */
  @Input() placeholder = 'Select a Value';
  /** Which tab to show first. */
  @Input() activeTab: DataSourceType = 'workflow';
  /** Pre-selected value(s). */
  @Input() value: SelectedValue | SelectedValue[] | null = null;

  /** When true, hides the trigger — the dialog is controlled externally via `openExternal`. */
  @Input() embedded = false;
  /** When `embedded`, this controls dialog visibility. */
  @Input() set openExternal(v: boolean) { this.open = v; }
  /** Show/hide individual tabs. */
  @Input() showWorkflow = true;
  @Input() showJson     = true;
  @Input() showGeotab   = true;

  // ─── Outputs ────────────────────────────────────────────────────────────────
  /** Fires whenever the selection changes — single or array depending on `multiSelect`. */
  @Output() selectionChange = new EventEmitter<SelectedValue | SelectedValue[] | null>();

  // ─── State ──────────────────────────────────────────────────────────────────
  @ViewChild('dialog') dialog?: ElementRef;
  open = false;
  searchTerm = '';
  expanded = new Set<string>();

  visibleTabs(): { id: DataSourceType; label: string }[] {
    const all = [
      { id: 'workflow' as const, label: 'Workflow Data', show: this.showWorkflow },
      { id: 'json'     as const, label: 'JSON',          show: this.showJson     },
      { id: 'geotab'   as const, label: 'Geotab',        show: this.showGeotab   },
    ];
    return all.filter(t => t.show);
  }

  // ─── Selection helpers ──────────────────────────────────────────────────────
  private get selectedArray(): SelectedValue[] {
    if (!this.value) return [];
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  hasSelection(): boolean {
    return this.selectedArray.length > 0;
  }

  isSelected(id: string): boolean {
    return this.selectedArray.some(v => v.id === id);
  }

  singleLabel(): string {
    return this.selectedArray[0]?.label ?? '';
  }

  selectionLabels(): string[] {
    return this.selectedArray.map(v => v.label);
  }

  select(item: SelectedValue) {
    if (this.multiSelect) {
      const existing = this.selectedArray.find(v => v.id === item.id);
      const next = existing
        ? this.selectedArray.filter(v => v.id !== item.id)
        : [...this.selectedArray, item];
      this.value = next;
      this.selectionChange.emit(next);
    } else {
      this.value = item;
      this.selectionChange.emit(item);
      this.close();
    }
  }

  clearSelection() {
    this.value = this.multiSelect ? [] : null;
    this.selectionChange.emit(this.value);
  }

  // ─── Open/close ─────────────────────────────────────────────────────────────
  toggle() { this.open ? this.close() : this.openDialog(); }
  openDialog() { this.open = true; }
  close() { this.open = false; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.open) return;
    const target = event.target as Node;
    const host = (this as any).constructor.hostElement?.nativeElement;
    if (host && !host.contains(target)) this.close();
  }

  setTab(tab: DataSourceType) {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  // ─── Expand/collapse ────────────────────────────────────────────────────────
  toggleExpand(key: string) {
    this.expanded.has(key) ? this.expanded.delete(key) : this.expanded.add(key);
  }
  isExpanded(key: string): boolean { return this.expanded.has(key); }

  // ─── Filtering ──────────────────────────────────────────────────────────────
  filteredSegments(): WorkflowSegment[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.workflow.segments;
    return this.workflow.segments
      .map(seg => ({
        ...seg,
        steps: seg.steps
          .map(step => ({
            ...step,
            actions: step.actions.filter(a => a.label.toLowerCase().includes(q)),
          }))
          .filter(step => step.label.toLowerCase().includes(q) || step.actions.length > 0),
      }))
      .filter(seg => seg.label.toLowerCase().includes(q) || seg.steps.length > 0);
  }

  filteredGeotab(): GeotabItem[] {
    const q = this.searchTerm.trim().toLowerCase();
    return q ? this.geotab.filter(i => i.label.toLowerCase().includes(q)) : this.geotab;
  }

  filteredJson(): JsonNode[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.json;
    const filter = (nodes: JsonNode[]): JsonNode[] =>
      nodes
        .map(n => {
          if (n.type === 'object' && n.children) {
            const kids = filter(n.children);
            if (n.key.toLowerCase().includes(q) || kids.length) return { ...n, children: kids };
            return null;
          }
          return n.key.toLowerCase().includes(q) ? n : null;
        })
        .filter((n): n is JsonNode => n !== null);
    return filter(this.json);
  }

  // ─── JSON helpers ───────────────────────────────────────────────────────────
  buildJsonId(path: string[], key: string): string {
    return [...path, key].join('.');
  }

  jsonTypeLabel(node: JsonNode): string {
    if (node.type === 'object') return '{ }';
    if (node.type === 'array')  return '[ ]';
    if (node.type === 'numeric') return '(Numeric)';
    if (node.type === 'date-time') return '(Date Time)';
    if (node.type === 'boolean') return '(Boolean)';
    return node.isArray ? '(String[])' : '(String)';
  }

  onJsonClick(node: JsonNode, path: string[]) {
    if (node.type === 'object' || node.type === 'array') {
      // Arrays of objects: clicking expands to inspect the shape;
      // selecting the array itself is done via the "Insert" pill on hover.
      this.toggleExpand('json-' + this.buildJsonId(path, node.key));
    } else {
      this.select({
        source: 'json',
        id: this.buildJsonId(path, node.key),
        label: node.key,
        type: node.isArray ? 'string-array' : node.type,
        path: path,
      });
    }
  }
}

// ─── Mock data matching the Figma ─────────────────────────────────────────────
const MOCK_WORKFLOW: WorkflowData = {
  segments: [
    { id: 'tender', label: 'Tender', steps: [] },
    {
      id: 'start-load', label: 'Start Load', steps: [
        { id: 'hooked-form', label: 'Hooked Form', actions: [
          { id: 'hf-1', label: '{Action Value Name}', actionType: 'Input' },
          { id: 'hf-2', label: '{Action Value Name}', actionType: 'Multi Select' },
        ]},
        { id: 'loaded-form', label: 'Loaded Form', actions: [
          { id: 'lf-1', label: '{Action Value Name}', actionType: 'Radio Button' },
        ]},
        { id: 'pre-trip', label: 'Pre-trip inspection', actions: [
          { id: 'pti-1', label: '{Action Value Name}', actionType: 'Input' },
          { id: 'pti-2', label: '{Action Value Name}', actionType: 'Input' },
          { id: 'pti-3', label: '{Action Value Name}', actionType: 'Input' },
          { id: 'pti-4', label: '{Action Value Name}', actionType: 'Date Time' },
          { id: 'pti-5', label: '{Action Value Name}', actionType: 'Temperature' },
          { id: 'pti-6', label: '{Action Value Name}', actionType: 'Slider Value' },
        ]},
        { id: 'depart', label: 'Depart', actions: [] },
      ],
    },
    { id: 'pick-up',  label: 'Pick Up',  steps: [] },
    { id: 'drop-off', label: 'Drop Off', steps: [] },
    { id: 'complete-load', label: 'Complete Load', steps: [] },
  ],
};

const MOCK_GEOTAB: GeotabItem[] = [
  { id: 'dot-number',         label: 'DOT number' },
  { id: 'drive-time',         label: 'Drive Time' },
  { id: 'duty-status',        label: 'Duty Status' },
  { id: 'eld-malfunction-1',  label: 'ELD in Malfunction' },
  { id: 'eld-malfunction-2',  label: 'ELD in Malfunction' },
  { id: 'hos-ruleset',        label: 'HOS Ruleset' },
  { id: 'remaining-drive',    label: 'Remaining drive time' },
  { id: 'trailer-attachment', label: 'Trailer Attachment Status' },
  { id: 'time-left-cycle',    label: 'Time left in Cycle' },
];

const MOCK_JSON: JsonNode[] = [
  { key: 'workflowOverride',         type: 'string'    },
  { key: 'id',                       type: 'numeric'   },
  { key: 'bolNumber',                type: 'numeric'   },
  { key: 'carrierSpecialInstructions', type: 'string'  },
  { key: 'shippingDate',             type: 'date-time' },
  { key: 'deliveryDate',             type: 'date-time' },
  { key: 'deliveryDate',             type: 'date-time' },
  { key: 'freightTerms',             type: 'string'    },
  {
    key: 'from', type: 'object', children: [
      { key: 'company',     type: 'string' },
      { key: 'address1',    type: 'string' },
      { key: 'city',        type: 'string' },
      { key: 'state',       type: 'string' },
      { key: 'postalCode',  type: 'string' },
      {
        key: 'contact', type: 'object', children: [
          { key: 'name',  type: 'string' },
          { key: 'phone', type: 'string' },
          { key: 'email', type: 'string' },
        ],
      },
    ],
  },
  {
    key: 'to', type: 'object', children: [
      { key: 'company',    type: 'string' },
      { key: 'address1',   type: 'string' },
      { key: 'city',       type: 'string' },
    ],
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<DataSourceSelectorComponent> = {
  title: 'Forms/Data Source Selector',
  component: DataSourceSelectorComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ButtonModule] })],
  parameters: {
    docs: {
      description: {
        component: `
A custom selector for choosing values from one of three data sources: **Workflow Data**, **Geotab**, or **JSON Payload**.

### Usage
\`\`\`html
<app-data-source-selector
  [workflow]="workflowData"
  [geotab]="geotabItems"
  [json]="jsonPayload"
  [multiSelect]="false"
  [value]="selected"
  (selectionChange)="onSelectionChange($event)"
/>
\`\`\`

### Data shapes
- **Workflow** — exactly 3 levels: \`Segment > Step > Action\`. Each action has a free-form \`actionType\` label (e.g. "Input", "Multi Select", "Date Time", "Temperature").
- **Geotab** — flat list of \`{ id, label }\` items.
- **JSON** — recursive tree of nodes. Set \`type: 'object'\` and supply \`children\` to nest; everything else is a leaf with type \`'string' | 'numeric' | 'date-time' | 'boolean'\`.

### Events
- \`selectionChange\` — emits \`SelectedValue\` (single) or \`SelectedValue[]\` (multi). Each value includes \`source\`, \`id\`, \`label\`, \`path\` (parent labels), and \`type\`.

### Single vs Multi
Set \`multiSelect = true\` to enable checkboxes. The dialog stays open with a footer showing Clear + Done. Single-select closes the dialog on click.
`,
      },
    },
  },
  argTypes: {
    multiSelect: { control: 'boolean' },
    placeholder: { control: 'text' },
    activeTab:   { control: 'inline-radio', options: ['workflow', 'json', 'geotab'] },
  },
};

export default meta;
type Story = StoryObj<DataSourceSelectorComponent>;

// ─── Stories ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    workflow:    MOCK_WORKFLOW,
    geotab:      MOCK_GEOTAB,
    json:        MOCK_JSON,
    multiSelect: false,
    placeholder: 'Select a Value',
    activeTab:   'workflow',
    value:       null,
  },
  parameters: {
    docs: { description: { story: 'Single-select with all 3 data sources populated. Click the trigger to open.' } },
  },
};

export const MultiSelect: Story = {
  args: {
    workflow:    MOCK_WORKFLOW,
    geotab:      MOCK_GEOTAB,
    json:        MOCK_JSON,
    multiSelect: true,
    placeholder: 'Select Values',
    activeTab:   'workflow',
    value:       [],
  },
  parameters: {
    docs: { description: { story: 'Multi-select with checkboxes. Dialog stays open while you pick; use Done to close.' } },
  },
};

export const GeotabDefault: Story = {
  args: {
    workflow:    MOCK_WORKFLOW,
    geotab:      MOCK_GEOTAB,
    json:        MOCK_JSON,
    placeholder: 'Select a Value',
    activeTab:   'geotab',
  },
};

export const JsonDefault: Story = {
  args: {
    workflow:    MOCK_WORKFLOW,
    geotab:      MOCK_GEOTAB,
    json:        MOCK_JSON,
    placeholder: 'Select a Value',
    activeTab:   'json',
  },
  parameters: {
    docs: { description: { story: 'JSON payload tab. Click an object key (blue) to expand its children. Leaf values are selectable.' } },
  },
};

export const PreSelected: Story = {
  args: {
    workflow:    MOCK_WORKFLOW,
    geotab:      MOCK_GEOTAB,
    json:        MOCK_JSON,
    multiSelect: false,
    activeTab:   'geotab',
    value: { source: 'geotab', id: 'duty-status', label: 'Duty Status' },
  },
  parameters: {
    docs: { description: { story: 'Demonstrates passing in a pre-selected value via the `value` input.' } },
  },
};
