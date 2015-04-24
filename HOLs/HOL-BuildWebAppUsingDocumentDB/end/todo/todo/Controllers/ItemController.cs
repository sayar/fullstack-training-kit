using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Todo.Models;

namespace Todo.Controllers
{
    public class ItemController : Controller
    {
        public ActionResult Index()
        {
            var items = DocumentDBRepository.GetIncompleteItems();
            return this.View(items);
        }

        public ActionResult Create()
        {
            return this.View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,Description,Completed")] Item item)
        {
            if (ModelState.IsValid)
            {
                await DocumentDBRepository.CreateItemAsync(item);
                return this.RedirectToAction("Index");
            }

            return this.View(item);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,Description,Completed")] Item item)
        {
            if (ModelState.IsValid)
            {
                await DocumentDBRepository.UpdateItemAsync(item);
                return this.RedirectToAction("Index");
            }

            return this.View(item);
        }

        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Item item = (Item)DocumentDBRepository.GetItem(id);
            if (item == null)
            {
                return this.HttpNotFound();
            }

            return this.View(item);
        }

        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Item item = (Item)DocumentDBRepository.GetItem(id);
            if (item == null)
            {
                return this.HttpNotFound();
            }

            return this.View(item);
        }

        [HttpPost, ActionName("Delete")]
        //// To protect against Cross-Site Request Forgery, validate that the anti-forgery token was received and is valid
        //// for more details on preventing see http://go.microsoft.com/fwlink/?LinkID=517254
        [ValidateAntiForgeryToken]
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        public async Task<ActionResult> DeleteConfirmed([Bind(Include = "Id")] string id)
        {
            await DocumentDBRepository.DeleteItemAsync(id);
            return this.RedirectToAction("Index");
        }

        public ActionResult Details(string id)
        {
            var item = DocumentDBRepository.GetItem(id);
            return this.View(item);
        }
    }
}