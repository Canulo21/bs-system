<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticlesController extends Controller
{
    //
     public function getArticlesTable() {
        $table = Article::orderBy('article_name', 'asc')->paginate(10);

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

    public function removeArticle(Request $request, $id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'message' => 'Article removed successfully'
        ]);
    }
}
