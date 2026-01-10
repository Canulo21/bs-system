<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticlesController extends Controller
{
    //

    public function getSelectArticles() {
        $articles = Article::orderBy('article_name', 'asc')->get(['id', 'article_name']);
        return response()->json($articles);
    }


    public function getArticlesTable(Request $request) {
        $query = Article::orderBy('article_name', 'asc');

        // Check if there is a search query
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('article_name', 'like', "%{$search}%");
        }

        // Paginate the results (10 per page)
        $table = $query->paginate(10);

        return response()->json($table);
    }

     public function createArticle(Request $request) {
        $article = $request->validate([
            'article_name' => 'required|string|unique:articles,article_name',
        ]);

        Article::create($article);

        return response()->json([
            'data' => $article,
            'message' => 'Article created successfully'
        ]);
    }

    public function updateArticle(Request $request, $id) {
        $articleData = $request->validate([
            'article_name' => 'required|string|unique:articles,article_name,' . $id,
        ]);

        $article = Article::findOrFail($id);
        $article->update($articleData);

        return response()->json([
            'data' => $article,
            'message' => 'Article updated successfully'
        ]);
    }

    public function removeArticle(Request $request, $id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'message' => 'Article removed successfully'
        ]);
    }
}
